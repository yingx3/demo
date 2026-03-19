"""
Shapefile推理脚本 - 使用训练好的LightGBM模型对shapefile进行易发性预测
"""

import sys, os

# 确保控制台输出 UTF-8
sys.stdout.reconfigure(encoding='utf-8', errors='ignore')
sys.stderr.reconfigure(encoding='utf-8', errors='ignore')

import geopandas as gpd
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from jenkspy import jenks_breaks
import warnings
import json
import ast
import re

warnings.filterwarnings("ignore")



#接收文件路径
folder = re.sub(r"\.[^.]+$", "", sys.argv[1])
#接收参数
json_str = sys.argv[2]
# params = json.loads(json_str)
fixed_str = re.sub(r'(\w+):', r'"\1":', json_str)
params = json.loads(fixed_str)

aspect = params["aspect"]
curvature = params["curvature"]
fault_distance = params["fault_distance"]
ndvi = params["ndvi"]
rainfall = params["rainfall"]
relief_amplitude = params["relief_amplitude"]

# ============================================================
# 配置参数
# ============================================================
# 模型和scaler路径
# 上级目录
BASE_DIR = Path(__file__).parent
# TODO: 请修改为实际路径
MODEL_PATH = BASE_DIR / "LightGBM.pkl"
SCALER_PATH = BASE_DIR / "standard_scaler.pkl"

# TODO: 输入输出shapefile路径,输入路径改为前端传入
# INPUT_SHP_PATH = BASE_DIR.parent.parent / "assets" / "input" / "waternet_new1.shp"
OUTPUT_SHP_PATH = BASE_DIR.parent.parent / "assets" / "output" / "waternet_results1.shp"

# ============================================================
# 列名映射：shapefile列名 -> 训练时的完整列名
# 确保推理时验证名没有问题
# ============================================================
COLUMN_MAPPING = {
    # shapefile列名 : 截断的名称
    "Aspect": "Aspect",
    "Curvature": "Curvature",
    "Fault dist": "Fault distance",
    "Glacier ar": "Glacier area ratio",
    "Gully grad": "Gully gradient",
    "NDVI": "NDVI",
    "Precipitat": "Precipitation",
    "Relief amp": "Relief amplitude",
    "Slope": "Slope",
    "Soil thick": "Soil thickness",
    "SPI": "SPI",
    "Stream Dis": "Stream Distance",
    "Surface ro": "Surface roughness",
    "Temperatur": "Temperature",
    "TWI": "TWI",
}

# 训练时的特征顺序
FEATURE_ORDER = [
    "Aspect",
    "Curvature",
    "Fault distance",
    "Glacier area ratio",
    "Gully gradient",
    "NDVI",
    "Precipitation",
    "Relief amplitude",
    "Slope",
    "Soil thickness",
    "SPI",
    "Stream Distance",
    "Surface roughness",
    "Temperature",
    "TWI",
]

# ============================================================
# 函数定义
# ============================================================


def load_model_and_scaler(model_path, scaler_path):
    """加载训练好的模型和标准化器"""
    print(f"模型路径: {model_path}")
    print(f"Scaler路径: {scaler_path}")
    # joblib.load用于读取机器学习模型，大文件，大字典的工具函数，将模型读到内存中。
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler


def load_and_prepare_shapefile(shp_path, column_mapping, feature_order, front_default_values):
    """
    读取shapefile，映射列名，并按训练时的顺序排列特征
    参数:
        shp_path: shapefile路径
        column_mapping: 列名映射字典
        feature_order: 训练时的特征顺序列表
        front_deaflut_values:前端传的默认值字典 例{"height":20,"density":0.5,"type":1}

    返回:
        gdf: GeoDataFrame（包含几何信息）
        features_df: 特征DataFrame（按正确顺序）
    """
    # 读取shapefile,gpd是geopandas的缩写
    gdf = gpd.read_file(shp_path)
    # 重命名列（shapefile列名 -> 训练列名）
    gdf_renamed = gdf.rename(columns=column_mapping)
    # 缺失列自动创建+前端值填充
    for col in feature_order:
        if col not in gdf_renamed.columns:
            #字段不存在，创建字段，用前端传的默认值填充
            defalut_val = front_default_values.get(col, 0) # 没有就0填充
            gdf_renamed[col] =defalut_val
            print(f"自动创建缺失列：{col}，默认值={defalut_val}")
    # 提取特征列，按训练时的顺序排列
    try:
        features_df = gdf_renamed[feature_order].copy()

    except KeyError as e:
        print(f"错误：缺少特征列 {e}")
        print(f"可用列名: {list(gdf_renamed.columns)}")
        raise

    # 检查缺失值
    missing_counts = features_df.isnull().sum()
    total_missing = missing_counts.sum()

    if total_missing > 0:
        print(f"发现 {total_missing} 个缺失值")
        for col, count in missing_counts[missing_counts > 0].items():
            print(f"  {col}: {count} 个缺失值")

        # 使用均值填充
        features_df = features_df.fillna(features_df.mean())
        print("已使用均值填充缺失值\n")
    else:
        print(f"无缺失值\n")

    return gdf, features_df


def perform_inference(model, scaler, features_df):
    """
    使用模型进行推理

    参数:
        model: 训练好的模型
        scaler: StandardScaler
        features_df: 特征DataFrame

    返回:
        probabilities: 易发性概率数组
    """

    # 标准化特征（必须使用训练时的scaler！）
    features_scaled = scaler.transform(features_df)
    # 预测概率
    probabilities = model.predict_proba(features_scaled)[:, 1]  # 取正类概率

    return probabilities


def classify_by_jenks(probabilities, n_classes=5):
    """
    使用自然间断点法将概率分为5类

    参数:
        probabilities: 概率数组
        n_classes: 分类数量（默认5）

    返回:
        class_labels: 分类标签数组
        breaks: 分类断点
    """

    # 计算断点
    breaks = jenks_breaks(probabilities, n_classes=n_classes)

    # 分类标签
    labels = ["极低", "低", "中等", "高", "极高"]

    # 分配类别
    classes = np.digitize(probabilities, breaks[1:-1], right=False)
    class_labels = np.array([labels[i] for i in classes])

    # 统计每类数量
    print(f"\n分类统计:")
    for label in labels:
        count = np.sum(class_labels == label)
        percentage = count / len(probabilities) * 100
        print(f"  {label:12s}: {count:6d} ({percentage:5.2f}%)")
    print()

    return class_labels, breaks


def save_results_to_shapefile(gdf, probabilities, classes, output_path):
    """
    将推理结果添加到shapefile并保存，安全覆盖已有文件

    参数:
        gdf: 原始GeoDataFrame
        probabilities: 概率数组
        classes: 分类数组
        output_path: 输出路径
    """
    from pathlib import Path

    output_path = Path(output_path)

    print("=" * 60)
    print("保存结果到Shapefile")
    print("=" * 60)

    # 确保输出目录存在
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 删除旧文件及相关文件（.shp/.shx/.dbf/.prj/.cpg）
    for ext in [".shp", ".shx", ".dbf", ".prj", ".cpg"]:
        f = output_path.with_suffix(ext)
        if f.exists():
            try:
                f.unlink()
                print(f"已删除旧文件: {f}")
            except Exception as e:
                print(f"无法删除文件 {f}: {e}")

    # 创建输出GeoDataFrame
    gdf_output = gdf.copy()

    # 添加结果列
    gdf_output["susc_class"] = classes  # 分类

    # 根据是否存在Id列选择保存字段
    if "Id" in gdf_output.columns:
        gdf_output = gdf_output[["Id", "susc_class", "geometry"]]
    else:
        gdf_output = gdf_output[["susc_class", "geometry"]]

    # 保存Shapefile
    gdf_output.to_file(output_path, encoding="GBK")
    print(f"OUTPUT_PATH={output_path}")

def main():
    """主执行流程"""

    try:
        # 1. 加载模型和scaler
        model, scaler = load_model_and_scaler(MODEL_PATH, SCALER_PATH)

        # 2. 读取并准备shapefile数据
        gdf, features_df = load_and_prepare_shapefile(
            INPUT_SHP_PATH, COLUMN_MAPPING, FEATURE_ORDER, front_values
        )

        # 3. 执行推理
        probabilities = perform_inference(model, scaler, features_df)

        # 4. 使用Jenks分类
        classes, breaks = classify_by_jenks(probabilities, n_classes=5)

        # 5. 保存结果
        save_results_to_shapefile(gdf, probabilities, classes, OUTPUT_SHP_PATH)

    except Exception as e:
        print("\n" + "=" * 60)
        print(f"error: {e}")
        print("=" * 60)
        import traceback

        traceback.print_exc()

def run_inference(INPUT_SHP_PATH,front_values):
    """
    供外部/前端调用的主函数
    :param INPUT_SHP_PATH :前端传入路径
    :param front_values:前端传入缺失字段默认值
    """
    try:
        print(f"前端传入的SHP路径：{INPUT_SHP_PATH}")
        # 1. 加载模型和scaler
        model, scaler = load_model_and_scaler(MODEL_PATH, SCALER_PATH)

        # 2. 读取并准备shapefile数据
        gdf, features_df = load_and_prepare_shapefile(
            INPUT_SHP_PATH, COLUMN_MAPPING, FEATURE_ORDER, front_values
        )

        # 3. 执行推理
        probabilities = perform_inference(model, scaler, features_df)

        # 4. 使用Jenks分类
        classes, breaks = classify_by_jenks(probabilities, n_classes=5)

        # 5. 保存结果
        save_results_to_shapefile(gdf, probabilities, classes, OUTPUT_SHP_PATH)


    except Exception as e:
        print("\n" + "=" * 60)
        print(f"error: {e}")
        print("=" * 60)
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # print(folder)
    path = BASE_DIR.parent.parent / "assets" / "input" / f"{folder}.shp"
    params={"Aspect":aspect,"Curvature":curvature,"Fault distance": fault_distance,"NDVI": ndvi,"Precipitation":rainfall,"Relief amplitude":relief_amplitude}
    run_inference(path,params)