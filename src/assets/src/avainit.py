#导入模块
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
import math
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import numpy as np

#顺层边坡稳定性分析模块类方法
class bedding():
    def __init__(self,t, alpha, theta, hi, hs, L0, c_, theta_, rs, Ks):  #初始函数获取计算参数 t:时间, alpha:坡度角, theta:滑面角, hi:冰层厚度, hs:裂隙高度, L0:滑面长度, c_:有效粘聚力, theta_:有效内摩擦角, rs:饱和岩体重度, Ks:饱和岩体渗透系数
        self.t=np.linspace(0, float(t.get())*3600, round(float(t.get())) * 600) #时间参数
        self.alpha=float(alpha.get())  #边坡坡度
        self.theta=float(theta.get())  #滑面角度
        self.hi=float(hi.get())  #冰层厚度
        self.hs=float(hs.get())  #裂隙高度
        self.L0=float(L0.get())  #滑面长度
        self.c_=float(c_.get())  #有效内摩擦角
        self.theta_=float(theta_.get())  #有效内摩擦角
        self.rs=float(rs.get())  #岩体饱和重度3
        self.Ks=float(Ks.get())  #饱和岩体渗透系数
        self.s1 = np.sin(np.radians(self.theta))  #滑面角正弦函数
        self.c1 = np.cos(np.radians(self.theta))  #滑面角余弦函数
        self.k1 = np.tan(np.radians(self.theta))  #滑面角正切函数
        self.k2 = np.tan(np.radians(self.alpha))  #坡度角正切函数
        self.rw = 10   #水的重度
        self.ri = 9.15    #冰的重度
        self.Af = 0.005  #裂隙面积
        self.tc = 40  #标准冰棱柱体融冰时长
        self.v0 = math.pi * 0.15 * 0.0038 ** 2  #标准冰棱柱体体积
        self.vf = self.hi * self.L0 * self.c1  #冰的初始体积
        self.ro = self.vf / self.v0  #换算系数

    #坡面函数
    def slope_surface(self, x):  #x:水平位置
        h = self.k1*x + self.L0*self.s1 + self.hs  #计算不同水平位置对应的坡面高度
        if x.any() <= (self.L0*(self.s1-self.c1) + self.hs)/(self.k2-self.k1):
            h = self.k2*x + self.L0*self.c1
        return h  #输出不同水平位置处的坡面高度

    #基岩表面函数
    def slope_base(self, x):  #x:水平位置
        h = self.k1 * x + self.L0 * self.s1  #计算不同水平位置对应的坡面高度
        return h  #输出不同水平位置处的坡面高度

    #融冰过程中冰体积随时间变化的函数
    def volume(self, t):  #t:时间参数
        v = 1.26 * self.vf * (np.e**(-0.2 * (t / (self.ro*self.tc))) - np.e**(-3.73 * np.square(t / (self.ro*self.tc))))
        return v  #输出不同时刻冰的体积

    #计算融冰水流强度随时间变化的函数
    def H(self, t, v):  #t:时间参数, v:体积参数
        Lambda = self.Ks / self.L0
        df = np.gradient(v, t[1]-t[0])
        h = (self.ri * df / (self.Af * self.rw) - self.Ks * self.s1) * np.e**(-Lambda * t)
        return h  #输出不同时刻融冰水的水流强度

    #计算安全系数的函数
    def factor_of_safety(self, t):  #t:时间参数
        x = np.linspace(-self.L0 * self.c1 / self.k2, 0, 10)  #将滑体划分为10段
        v = self.volume(t)  #调用函数计算冰融化的体积
        h = (self.vf - v) / (self.L0 * self.c1)  #计算为融化的冰的体积
        surf1=self.slope_surface(x)  #调用函数计算边坡表面高度
        surf2=self.slope_base(x)  #调用函数计算基岩表面高度
        m = self.rs * ((x[1]-x[0])*np.cumsum(surf1, 0)[-1] - (x[1]-x[0])*np.cumsum(surf2, 0))[-1] + self.ri * h * self.L0 * self.c1  #计算滑体重力
        HH=-self.H(t, v)  #调用函数计算融冰水水流强度
        ht = (t[1]-t[0])*np.array(np.cumsum(HH, 0))  #计算不同时刻裂隙中融冰水水头高度
        resist = self.c_ * self.L0 + (m * self.c1 - 0.5 * self.rw * ht * self.L0 - 0.5 * self.s1 * self.rw * np.square(ht)) * np.tan(np.radians(self.theta_))  #计算不同时刻的抗滑力
        drive = m * self.s1 + 0.5 * self.c1 * self.rw * np.square(ht)  #计算不同时刻的下滑力
        fos = resist / drive  #计算不同时刻的安全系数
        return fos   #输出不同时刻的下滑力

    #执行运算的函数
    def run(self):
        t=self.t  #获取时间参数
        fos = self.factor_of_safety(t)  #调用函数计算安全系数
        if np.any(fos < 1):  # 判断是否存在安全系数小于1
            # 满足存在安全系数小于1的条件输出0
            np.savetxt(r'.\output_bedding.txt', (np.array([0])))
        else:
            # 不满足存在安全系数小于1的条件输出1
            np.savetxt(r'.\output_bedding.txt', np.array([1]))
        fig, ax = plt.subplots(layout='constrained')  #创建画布
        ax.plot(t/(3600*24), fos, 'b', label='FOS')  #绘制安全系数图
        ax.set_xlabel('t (days)')  #设置x轴名称
        ax.set_ylabel('Facter Of Safety')  #设置y轴名称
        ax.set_xlim(0)  #设置x轴最小值
        ax.set_ylim(np.min(fos))  #设置y轴最小值
        plt.legend()  #绘制图例
        plt.show()  #显示安全系数图片

#反倾边坡稳定性分析模块类方法
class anti():
    def __init__(self,t, alpha, beta, hi, hs, b, c_, theta_, rs, Ks):  #初始函数获取计算参数  #初始函数获取计算参数 t:时间, alpha:坡度角, beta:滑面角, hi:冰层厚度, hs:裂隙高度, b:反倾结构宽度, c_:有效粘聚力, theta_:有效内摩擦角, rs:饱和岩体重度, Ks:饱和岩体渗透系数
        self.t=np.linspace(0, float(t.get())*3600, round(float(t.get())) * 600)  #时间参数
        self.alpha=float(alpha.get())  #坡面角度
        self.beta=float(beta.get())  #反倾角度
        self.hi=float(hi.get())  #冰层高度
        self.hs=float(hs.get())  #边坡高度
        self.b=float(b.get())  #反倾结构宽度
        self.c_=float(c_.get())  #有效粘聚力
        self.theta_=float(theta_.get())  #有效内摩擦角
        self.rs=float(rs.get())  #饱和岩体重度
        self.Ks=float(Ks.get())  #饱和岩体渗透系数
        self.rw = 10.00  #水的重度
        self.ri = 9.15  #冰的重度
        self.tc = 40  #标准冰棱柱体的融冰时长
        self.v0 = math.pi * 0.15 * 0.0038 ** 2  #标准冰棱柱体的体积
        self.vf = self.hi * self.hs * np.tan(np.radians(self.beta))  #冰层的体积
        self.ro = self.vf / self.v0  #换算系数
        self.L0 = self.hs / np.sin(np.radians(90-self.beta))  #滑动面长度
        self.s1 = np.sin(np.radians(90-self.beta))  #滑动面倾角正弦函数
        self.Af = 0.005  #裂隙宽度

    #反倾边坡坡面函数
    def anti_inclined_slope(self, x, b, beta):  #x:水平位置, b:反倾结构宽度, beta:反倾结构倾角
        if x <= 0:  #判断水平位置在水平坐标轴上是否小于0
            return -x * b / np.tan(np.radians(beta))  #返回水平位置对应的坡面高度
        elif 0 < x <= self.hs * np.sin(np.radians(self.alpha + beta)) / (b * np.sin(np.radians(self.alpha))):  #判断水平位置在水平坐标轴上是否大于0且小于滑面顶部对应的水平位置坐标
            return -x * b / np.tan(np.radians(self.alpha + beta))  #返回水平位置对应的坡面高度
        elif x >= self.hs * np.sin(np.radians(self.alpha + beta)) / (b * np.sin(np.radians(self.alpha))):  #判断水平位置在水平坐标轴上是否大于滑面顶部对应的水平位置坐标
            return self.hs / np.sin(np.radians(beta)) - x * b / np.tan(np.radians(beta))  #返回水平位置对应的坡面高度

    #冰层表面函数
    def ice_surface(self, x, b, beta, h):  #x:水平位置, b:反倾结构宽度, beta:反倾结构倾角, h:冰层厚度
        if x <= h.all() * np.cos(np.radians(beta)):
            return -x * b / np.tan(np.radians(self.alpha)) + h * (
                        np.sin(np.radians(beta)) - np.cos(np.radians(beta)) / np.tan(np.radians(beta)))  #返回水平位置对应的冰面高度
        elif h.all() * np.cos(np.radians(beta)) < x <= h.all() * np.cos(np.radians(beta)) + self.hs * np.sin(
                np.radians(self.alpha + beta)) / (b * np.sin(np.radians(self.alpha))):
            return -x * b / np.tan(np.radians(self.alpha + beta)) + h * (
                        np.sin(np.radians(beta)) - np.cos(np.radians(beta)) / np.tan(np.radians(self.alpha + beta)))  #返回水平位置对应的冰面高度
        elif x >= h.all() * np.cos(np.radians(beta)) + self.hs * np.sin(np.radians(self.alpha + beta)) / (
                b * np.sin(np.radians(self.alpha))):
            return self.hs / np.sin(np.radians(beta)) - x * b / np.tan(np.radians(self.alpha)) + h * (
                        np.sin(np.radians(beta)) - np.cos(np.radians(beta)) / np.tan(np.radians(beta)))  #返回水平位置对应的冰面高度

    #融冰过程中冰体积随时间变化的函数
    def volume(self, t):  #t:时间参数
        v = 1.26 * self.vf * (np.e**(-0.2 * (t / (self.ro*self.tc))) - np.e**(-3.73 * np.square(t / (self.ro*self.tc))))
        return v  #返回融冰的体积

    #计算融冰水流强度随时间变化的函数
    def H(self, t, l):  #t:时间参数, l:水流的路径长度
        Lambda = self.Ks*np.sin(np.radians(self.beta)) / l
        v = self.volume(t)  #调用体积函数求解融冰体积
        df = np.gradient(v, t[1]-t[0])  #求解体积变化的速率
        q = self.ri * df / (self.Af * self.rw)
        h = (q - self.Ks * self.s1) * np.exp(-Lambda * t)  #求解融冰水水流强度
        return h  #输出不同时刻融冰水的水流强度

    #计算安全系数的函数
    def factor_of_safety(self, t):  #t:时间参数
        L = self.hs / np.cos(np.radians(self.beta))  #计算滑面长度
        n = int(L / self.b)  #反倾结构数量
        v = self.volume(t)  #计算融冰体积
        h = (self.vf - v) / (self.hs * np.tan(np.radians(self.beta)))  #计算冰层厚度
        r = 0
        d = 0
        for i in range(n):
            h_ice1 = self.ice_surface(i, self.b, self.beta, h) - self.anti_inclined_slope(i, self.b, self.beta)  #计算第i块反倾结构体左侧的冰层高度
            h_ice2 = self.ice_surface(i + 1, self.b, self.beta, h) - self.anti_inclined_slope(i + 1, self.b, self.beta)  #计算第i块反倾结构体左侧的冰层高度
            h1 = self.anti_inclined_slope(i, self.b, self.beta)  #计算第i块反倾结构体左侧的坡面高度
            h2 = self.anti_inclined_slope(i + 1, self.b, self.beta)  #计算第i块反倾结构体右侧的坡面高度
            hh1 = 0  # 假设第i块反倾结构体左侧的融冰水流
            if i * self.b > 0:  # 判断反倾结构体在水平坐标轴上的位置
                hh1 = -self.H(t, i * self.b)  # 替换假设的第i块反倾结构体左侧的融冰水流强度
            hh2 = -self.H(t, (i + 1) * self.b)  # 计算第i块反倾结构体右侧的融冰水流强度
            ht1 = (t[1] - t[0]) * np.cumsum(hh1, 0)  # 计算第i块反倾结构体左侧的融冰水头高度
            ht2 = (t[1] - t[0]) * np.cumsum(hh2, 0)  # 计算第i块反倾结构体右侧的融冰水头高度
            r += 0.5 * self.rw * np.square(ht1) * np.sin(np.radians(self.beta)) + self.c_ * self.b + (
                    self.rs * 0.5 * (h1 + h2) * self.b + self.ri * 0.5 * (
                    h_ice1 + h_ice2) * self.b - 0.5 * self.rw * (ht1 + ht2) * self.b) * np.sin(
                np.radians(self.beta)) * np.tan(np.radians(self.theta_))  # 求和计算所有反倾结构体的抗滑力
            d += (self.rs * 0.5 * (h1 + h2) * self.b + self.ri * 0.5 * (h_ice1 + h_ice2) * self.b) * np.cos(
                np.radians(self.beta)) + 0.5 * self.rw * np.square(ht2) * np.sin(
                np.radians(self.beta))  # 求和计算所有反倾结构体的下滑力

        Fos = r / d
        return Fos

    #执行运算的函数
    def run(self):
        t, alpha, beta=self.t, self.alpha, self.beta  #时间, 坡度角, 反倾角
        if alpha+beta < 90:  #判断输入的坡度角和反倾角参数是否满足计算要求
            tk.messagebox.showerror(title='提示', message="坡度角(α)与反倾角(β)之和需≥90°，请重新输入")
        else:
            fos = self.factor_of_safety(t)  #调用函数计算安全系数
            if np.any(fos < 1):  # 判断是否存在安全系数小于1
                # 满足存在安全系数小于1的条件输出0
                np.savetxt(r'.\output_anti.txt', (np.array([0])))
            else:
                # 不满足存在安全系数小于1的条件输出1
                np.savetxt(r'.\output_anti.txt', np.array([1]))
            fig, ax = plt.subplots(layout='constrained')  #创建画布
            ax.plot(t / (3600 * 24), fos, 'b', label='FOS')  #绘制安全系数图
            ax.set_xlabel('t (days)')  #设置x轴名称
            ax.set_ylabel('Facter Of Safety')  #设置y轴名称
            ax.set_xlim(0)  #设置x轴最小值
            ax.set_ylim(np.min(fos))  #设置y轴最小值
            plt.legend()  #绘制图例
            plt.show()  #显示安全系数图片

#三维楔形滑体边坡稳定性分析模块类方法
class wedge():
    def __init__(self,n1, hi, hs, a, t, alpha, c_, theta_, Ks, rs, ratio):  #初始函数获取计算参数 n1:楔形体单侧底面法向量, hi:冰层厚度, hs:裂隙高度, a:楔形体单侧底面面积, t:时间, alpha:坡度角, c_:有效粘聚力, theta_:有效内摩擦角, Ks:饱和岩体渗透系数, rs:饱和岩体重度, ratio:裂隙长度与楔体底部中线长度比值
        self.ratio=float(ratio.get())  #裂隙长度与楔体底部中线长度比值
        if len(n1.get().split(','))!=3:  #判断输入的向量格式是否正确
            tk.messagebox.showerror(title='提示', message='输入向量不正确，请在英文状态下输入（例：1,2,1.3）')
        self.n1 = np.array([float(i) for i in tuple(n1.get().split(','))])  #楔形体单侧底面法向量
        self.n2 = np.array([-self.n1[0], self.n1[1], self.n1[2]])  #楔形体单侧底面法向量
        self.hi=float(hi.get())  #冰层厚度
        self.hs=float(hs.get())  #裂隙高度
        self.a1=float(a.get())  #楔形体单侧底面面积
        self.a2 =  self.a1  #楔形体单侧底面面积
        self.t = np.linspace(0, float(t.get()) * 3600, round(float(t.get())) * 600)  #时间参数
        self.alpha = float(alpha.get())  #坡度角
        self.c_=float(c_.get())  #有效粘聚力
        self.theta_=float(theta_.get())  #有效内摩擦角
        self.rs=float(rs.get())  #饱和岩体重度
        self.Ks=float(Ks.get())  #饱和岩体渗透系数
        self.rw = 10  #水的重度
        self.ri = 9.15  #冰的重度
        self.tc = 40  #标准冰棱柱体的融冰时长
        self.v0 = math.pi * 0.15 * 0.0038 ** 2  #标准冰棱柱体的体积
        z = np.array([0, 0, 1])  #竖直向上的向量
        N1, N2 = self.unit(self.n1), self.unit(self.n2)  #楔形体两侧底面法向量的单位向量
        l = np.cross(N1, N2)  #楔形体两侧底面交线的向量
        d = self.unit(l)  #楔形体两侧底面交线向量的单位向量
        if d[2] > 0:  #判断交线向量的方向
            d = -d  #设置交线向量指向滑动方向
        self.omga = np.radians(180-np.degrees(np.arccos(np.dot(d, z))))  #交线向向量与Z轴的夹角
        self.norm_d = np.array([0, np.cos(self.omga), np.sin(self.omga)])  #与交线向量垂直的向量
        self.d0 = abs(self.hs * np.tan(self.omga))  #交线向量在水平面上的投影长度
        d2 = abs(self.hs / np.tan(np.radians(self.alpha)))  #坡面中线在水平面上的投影长度
        d1 = self.d0 - d2  #交线向量与坡面中线在水平面上的投影长度差值
        ls = 2 * (abs(self.a1 * np.dot(N1, z)) + abs(self.a2 * np.dot(N2, z))) / self.d0  #楔形体与披肩相交的线段长度
        self.s1 = 0.5 * ls * d1  #楔形体与坡度相交处在水平面上的面积
        self.s2 = 0.5 * ls * d2 / np.cos(np.radians(self.alpha))  #楔形体与斜坡面相交处在水平面上的投影面积
        self.vf = self.hi * (self.s1 + np.cos(np.radians(self.alpha)) * self.s2)  #楔形体上的冰层体积
        self.ro = self.vf / self.v0  #换算系数
        self.ll=np.sqrt(np.square(self.d0)+np.square(self.hs))  #交线向量的长度
        self.l1=np.sqrt(np.square(0.5*ls)+np.square(d1))  #楔形体与坡顶相交形成的等腰三角形腰长
        self.af=self.a1*(1-np.square(self.ratio))  #岩桥面积
        self.hf=2*self.af/((1+self.ratio)*self.l1)  #裂隙长度在Z轴上的投影长度
        self.sb=np.square(self.ratio)
        self.sbz=abs(self.sb*np.dot(N1, z))  #裂隙面积比在数值方向上的投影
        self.Af=0.005  #裂隙面积

    #融冰过程中冰体积随时间变化的函数
    def volume(self, t):  #t:时间参数
        v = 1.26 * self.vf * (np.e**(-0.2 * (t / (self.ro*self.tc))) - np.e**(-3.73 * np.square(t / (self.ro*self.tc))))
        return v  #返回融冰体积

    #计算融冰水流强度随时间变化的函数
    def H(self, t):  #t:时间参数
        Lambda = self.Ks/self.sb
        v = self.volume(t)  #调用体积函数求解融冰体积
        df = np.gradient(v, t[1]-t[0])  #求解体积变化的速率
        q = self.ri * df / (self.Af*self.l1*2 * self.rw)
        h = (q - self.Ks * self.sbz/self.sb) * np.exp(-Lambda * t)  #求解融冰水水流强度
        return h  #输出不同时刻融冰水的水流强度

    #将普通向量转换为单位向量的函数
    def unit(self, N):  #N:向量
        n = np.linalg.norm(N)  #计算向量的模长
        if n == 0:
            raise ValueError("zero vector")
        return N / n  #将向量转化为模长为一的单位向量

    #计算安全系数的函数
    def factor_of_safety(self, t):
        v = self.volume(t)  #调用体积函数求解融冰体积
        h = (self.vf - v) / (self.s1 + np.cos(np.radians(self.alpha)) * self.s2)  #计算冰层厚度
        mass = self.rs * self.s1 * self.hs/3  #计算楔形滑体的重力
        HH = -self.H(t)  #调用函数计算融冰水水流强度
        ht = (t[1] - t[0]) * np.array(np.cumsum(HH, 0))  #计算不同时刻裂隙中融冰水水头高度
        wp = self.rw*ht*self.hf*(1+2*self.ratio)*self.l1/6 + self.rw*ht*self.sb/3  #计算不同时刻裂隙中的孔隙水压力
        drive = (mass + self.ri*h) * np.cos(self.omga)  #计算不同时刻的下滑力
        resis = (mass + self.ri*h) * np.sin(self.omga)*np.tan(np.radians(self.theta_)) + 2*self.c_*(self.a1-self.af) - 2*wp*np.dot(self.n1, self.norm_d)  #计算不同时刻的抗滑力
        fos = resis/drive  #计算不同时刻的安全系数
        return fos  #输出不同时刻的安全系数

    #执行运算的函数
    def run(self):
        t, ratio, omga, alpha=self.t, self.ratio, self.omga, self.alpha  #时间, 裂隙与楔形滑体中线长度比值, 楔体中线与竖向的夹角, 坡面倾角
        if ratio == 0 or ratio < 0.05 or ratio > 1:  #判断输入的比例参数是否符合计算要求
            tk.messagebox.showwarning(title='提示', message='Ra取值过小或过大，请在0.05至1范围内取值')
        elif 90-np.degrees(omga)-alpha>=0:
            tk.messagebox.showwarning(title='提示', message=f'楔体滑动倾角({np.round(90-np.degrees(omga),1)}°)>边坡倾角({alpha}°)，请输入正确的法向量或增大边坡倾角')
        else:
            fos = self.factor_of_safety(t)  #调用函数计算安全系数
            if np.any(fos < 1):  # 判断是否存在安全系数小于1
                # 满足存在安全系数小于1的条件输出0
                np.savetxt(r'.\output_wedge.txt', (np.array([0])))
            else:
                # 不满足存在安全系数小于1的条件输出1
                np.savetxt(r'.\output_wedge.txt', np.array([1]))
            fig, ax = plt.subplots(layout='constrained')  #创建画布
            ax.plot(t / (3600 * 24), fos, 'b', label='FOS')  #绘制安全系数图
            ax.set_xlabel('t (days)')  #设置x轴名称
            ax.set_ylabel('Facter Of Safety')  #设置y轴名称
            ax.set_ylim(np.min(fos))  #设置y轴最小值
            ax.set_xlim(0)  #设置x轴最小值
            plt.legend()  #绘制图例
            plt.show()  #显示安全系数图片


root = tk.Tk()  #创建软件操作界面画布
root.title('冰岩崩启动分析程序V1.0')  #软件名称
root.geometry('430x800+100+100')  #设置操作界面窗口大小
root.attributes("-alpha", 0.9)  #设置操作界面的透明度
root['background'] = "#ffffff"  #设置操作界面的背景色


#设置参数名称字体的函数1
def widget_frame1(frame, width, para1, para2, para3, index1, index2, index3, index4, row, column):
    text_widget = tk.Text(frame, height=2, width=width, bd=0, bg="#F2F2F2", wrap="none")
    text_widget.insert(tk.END, para1)
    text_widget.tag_add("chinese", index1, index2)
    text_widget.tag_configure("chinese", font=('宋体', 12))

    text_widget.insert(tk.END, para2)
    text_widget.tag_add("english", index2, index3)
    text_widget.tag_configure("english", font=('Times New Roman', 12))

    text_widget.insert(tk.END, para3)
    text_widget.tag_add("english", index3, index4)
    text_widget.tag_configure("english", font=('Times New Roman', 12))

    text_widget.grid(row=row, column=column, padx=0, pady=2, sticky='w')
    text_widget.config(state=tk.DISABLED)

#设置参数名称字体的函数2
def widget_frame2(frame, width, para1, para2, para3, para4, index1, index2, index3, index4, index5, row, column):
    text_widget = tk.Text(frame, height=2, width=width, bd=0, bg="#F2F2F2", wrap="none")
    text_widget.insert(tk.END, para1)
    text_widget.tag_add("chinese", index1, index2)
    text_widget.tag_configure("chinese", font=('宋体', 12))

    text_widget.insert(tk.END, para2)
    text_widget.tag_add("english", index2, index3)
    text_widget.tag_configure("english", font=('Times New Roman', 12))

    text_widget.insert(tk.END, para3)
    text_widget.tag_add("chinese", index3, index4)
    text_widget.tag_configure("chinese", font=('宋体', 12))

    text_widget.insert(tk.END, para4)
    text_widget.tag_add("english", index4, index5)
    text_widget.tag_configure("english", font=('Times New Roman', 11))

    text_widget.grid(row=row, column=column, padx=0, pady=2)
    text_widget.config(state=tk.DISABLED)

#创建顺层边坡稳定性分析操作界面的函数
def create_bedding(Frame, text):  #Frame:软件界面对象, text:软件界面名称
    #定义界面的背景颜色、名称及其字体与大小
    tk.Label(Frame, text=text, border=5, anchor=tk.CENTER, foreground='black', bg="#DEEBF7",
             font=('宋体', 16), width=40).pack(padx=5,
                                               pady=5)
    #定义加载图片的区域
    Frame_pic = tk.Frame(Frame)
    Frame_pic.pack(anchor=tk.N, padx=5, pady=5)

    #打开软件界面要加载的图片
    img = Image.open(r'.\img\bedding.png')
    width, height = img.width, img.height
    resized_img = img.resize((width, height), Image.LANCZOS)
    tk_img = ImageTk.PhotoImage(resized_img)

    #加载软件界面要加载的图片
    photo_label = tk.Label(Frame_pic, image=tk_img)
    photo_label.image = tk_img
    photo_label.pack(side=tk.LEFT, fill=tk.Y)

    #定义输入几何参数的区域
    Frame_para_geo = tk.LabelFrame(Frame, text='几何与时间参数', foreground='black', bg="#F2F2F2",
                                   font=('宋体', 16), labelanchor='n', relief='ridge')
    Frame_para_geo.pack(anchor=tk.N, padx=5, pady=5, fill='both')

    #在定义输入几何参数的区域内布局参数输入的窗口名称
    widget_frame1(Frame_para_geo, 12, '坡角度', '(α °)', ': ', '1.0', '1.3', '1.8', '1.10', 0, 0)
    widget_frame2(Frame_para_geo, 20, '初始冰厚度', '(h', '冰', ' m): ', '1.0', '1.5', '1.7', '1.8', '1.12', 0, 3)
    widget_frame1(Frame_para_geo, 12, '滑面角', '(β °)', ': ', '1.0', '1.3', '1.8', '1.10', 1, 0)
    widget_frame2(Frame_para_geo, 20, '裂隙高度', '(h', '裂隙', ' m): ', '1.0', '1.4', '1.6', '1.8', '1.12', 1, 3)
    widget_frame1(Frame_para_geo, 15, '融冰时长', '(t h)', ': ', '1.0', '1.4', '1.8', '1.10', 2, 0)
    widget_frame1(Frame_para_geo, 16, '滑面长度', '(L0 m)', ': ', '1.0', '1.4', '1.10', '1.12', 2, 3)

    #在定义输入几何参数的区域内布局接收对应参数的窗口
    slope_angle = tk.Entry(Frame_para_geo, width=10)  #坡角度
    ice_thickness = tk.Entry(Frame_para_geo, width=10)  #冰层厚度
    interlayer_angle = tk.Entry(Frame_para_geo, width=10)  #滑面角
    fissure_height = tk.Entry(Frame_para_geo, width=10)  #裂隙高度
    melt_duration = tk.Entry(Frame_para_geo, width=10)  #融冰时长
    interlayer_length = tk.Entry(Frame_para_geo, width=10)  #滑面长度

    #定义接收对应几何参数窗口的位置布局
    slope_angle.grid(row=0, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #坡角度
    ice_thickness.grid(row=0, column=4, padx=2, pady=2, sticky='e')  #冰层厚度
    interlayer_angle.grid(row=1, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #滑面角
    fissure_height.grid(row=1, column=4, padx=2, pady=2, sticky='e')  #裂隙高度
    melt_duration.grid(row=2, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #融冰时长
    interlayer_length.grid(row=2, column=4, padx=2, pady=2, sticky='e')  #滑面长度

    #定义输入几力学参数的区域
    Frame_para_mech = tk.LabelFrame(Frame, text='力学参数', foreground='black', bg="#F2F2F2", font=('宋体', 16),
                                    labelanchor='n', relief='ridge', width=420)
    Frame_para_mech.pack(anchor=tk.N, padx=5, pady=5)

    #在定义输入力学参数的区域内布局参数输入的窗口名称
    widget_frame1(Frame_para_mech, 20, '有效内摩擦角', "(φ' °)", ': ', '1.0', '1.6', '1.12', '1.14', 0, 0)
    widget_frame1(Frame_para_mech, 20, '有效内聚力', "(c' kPa)", ': ', '1.0', '1.5', '1.12', '1.14', 0, 3)
    widget_frame1(Frame_para_mech, 20, '饱和渗透系数', '(Ks)', ': ', '1.0', '1.6', '1.10', '1.12', 1, 0)
    widget_frame1(Frame_para_mech, 20, '岩体重度', '(γ', ' kN/m^3): ', '1.0', '1.4', '1.6', '1.16',  1, 3)

    #在定义输入力学参数的区域内布局接收对应参数的窗口
    friction_angle = tk.Entry(Frame_para_mech, width=8)  #有效内摩擦角
    cohesion = tk.Entry(Frame_para_mech, width=8)  #有效粘聚力
    permeability = tk.Entry(Frame_para_mech, width=8)  #饱和岩体渗透系数
    mass_density = tk.Entry(Frame_para_mech, width=8)  #饱和岩体的重度

    #定义接收对应力学参数窗口的位置布局
    friction_angle.grid(row=0, column=1, padx=4, pady=2, sticky='w')  #有效内摩擦角
    cohesion.grid(row=0, column=4, padx=4, pady=2, sticky='e')  #有效粘聚力
    permeability.grid(row=1, column=1, padx=4, pady=10, sticky='w')  #饱和岩体渗透系数
    mass_density.grid(row=1, column=4, padx=4, pady=10, sticky='e')  #饱和岩体的重度

    #定义执行安全系数计算的按钮
    run_frame = tk.Frame(Frame, bg='#ffffff', padx=0, pady=0)
    run_frame.pack(fill=tk.BOTH)

    #将定义执行安全系数计算的按钮与顺层边坡稳定性分析模块类方法进行绑定实现方法的调用
    Run_btn = tk.Button(run_frame, text='运行计算FOS', bg='#ffffff',
                        command=lambda: bedding(melt_duration, slope_angle, interlayer_angle, ice_thickness,
                                                fissure_height, interlayer_length, cohesion, friction_angle,
                                                mass_density, permeability).run())
    Run_btn.pack(anchor=tk.CENTER)  #显示执行按钮

#创建反倾边坡稳定性分析操作界面的函数
def create_anti(Frame, text):  #Frame:软件界面对象, text:软件界面名称
    #定义界面的背景颜色、名称及其字体与大小
    tk.Label(Frame, text=text, border=5, anchor=tk.CENTER, foreground='black', bg="#FFF2CC",
             font=('宋体', 16), width=40).pack(padx=5,
                                               pady=5)
    #定义加载图片的区域
    Frame_pic = tk.Frame(Frame)
    Frame_pic.pack(anchor=tk.N, padx=5, pady=5)

    #打开软件界面要加载的图片
    img = Image.open(r'.\img\antislope.png')
    width, height = img.width, img.height
    resized_img = img.resize((width, height), Image.LANCZOS)
    tk_img = ImageTk.PhotoImage(resized_img)

    #加载软件界面要加载的图片
    photo_label = tk.Label(Frame_pic, image=tk_img)
    photo_label.image = tk_img
    photo_label.pack(side=tk.LEFT, fill=tk.Y)

    #定义输入几何参数的区域
    Frame_para_geo = tk.LabelFrame(Frame, text='几何与时间参数', foreground='black', bg="#F2F2F2",
                                   font=('宋体', 16), labelanchor='n', relief='ridge')
    Frame_para_geo.pack(anchor=tk.N, padx=5, pady=5, fill='both')

    #在定义输入几何参数的区域内布局参数输入的窗口名称
    widget_frame1(Frame_para_geo, 12, '坡角度', '(α °)', ': ', '1.0', '1.3', '1.8', '1.11', 0, 0)
    widget_frame2(Frame_para_geo, 20, '初始冰厚度', '(h', '冰', ' m): ', '1.0', '1.5', '1.7', '1.8', '1.13', 0, 3)
    widget_frame1(Frame_para_geo, 12, '反倾角', '(β °)', ': ', '1.0', '1.3', '1.8', '1.11', 1, 0)
    widget_frame2(Frame_para_geo, 20, '边坡高度', '(h', '边坡', ' m): ', '1.0', '1.4', '1.6', '1.8', '1.13', 1, 3)
    widget_frame1(Frame_para_geo, 15, '融冰时长', '(t h)', ': ', '1.0', '1.4', '1.9', '1.11', 2, 0)
    widget_frame1(Frame_para_geo, 15, '层面间隔', '(b m)', ': ', '1.0', '1.4', '1.9', '1.11', 2, 3)

    #在定义输入几何参数的区域内布局接收对应参数的窗口
    slope_angle = tk.Entry(Frame_para_geo, width=10)  #坡角度
    ice_thickness = tk.Entry(Frame_para_geo, width=10)  #冰层厚度
    anti_angle = tk.Entry(Frame_para_geo, width=10)  #反倾角
    slope_height = tk.Entry(Frame_para_geo, width=10)  #边坡高度
    melt_duration = tk.Entry(Frame_para_geo, width=10)  #融冰时长
    layer_width = tk.Entry(Frame_para_geo, width=10)  #单个反倾结构宽度

    #定义接收对应几何参数窗口的位置布局
    slope_angle.grid(row=0, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #坡角度
    ice_thickness.grid(row=0, column=4, padx=2, pady=2, sticky='e')  #冰层厚度
    anti_angle.grid(row=1, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #反倾角
    slope_height.grid(row=1, column=4, padx=2, pady=2, sticky='e')  #边坡高度
    melt_duration.grid(row=2, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #融冰时长
    layer_width.grid(row=2, column=4, padx=2, pady=2, sticky='e')  #单个反倾结构宽度

    #定义输入力学参数的区域
    Frame_para_mech = tk.LabelFrame(Frame, text='力学参数', foreground='black', bg="#F2F2F2", font=('宋体', 16),
                                    labelanchor='n', relief='ridge')
    Frame_para_mech.pack(anchor=tk.N, padx=5, pady=5)

    #在定义输入力学参数的区域内布局参数输入的窗口名称
    widget_frame1(Frame_para_mech, 20, '有效内摩擦角', "(φ' °)", ': ', '1.0', '1.6', '1.12', '1.14', 0, 0)
    widget_frame1(Frame_para_mech, 20, '有效内聚力', "(c' kPa)", ': ', '1.0', '1.5', '1.12', '1.14', 0, 3)
    widget_frame1(Frame_para_mech, 20, '饱和渗透系数', '(Ks)', ': ', '1.0', '1.6', '1.10', '1.12', 1, 0)
    widget_frame1(Frame_para_mech, 20, '岩体重度', '(γ', ' kN/m^3): ', '1.0', '1.4', '1.6', '1.16',  1, 3)

    #在定义输入力学参数的区域内布局接收对应参数的窗口
    friction_angle = tk.Entry(Frame_para_mech, width=8)  #有效内摩擦角
    cohesion = tk.Entry(Frame_para_mech, width=8)  #有效粘聚力
    permeability = tk.Entry(Frame_para_mech, width=8)  #岩体饱和渗透系数
    mass_density = tk.Entry(Frame_para_mech, width=8)  #岩体饱和重度

    #定义接收对应力学参数窗口的位置布局
    friction_angle.grid(row=0, column=1, padx=2, pady=2, sticky='w')  #有效内摩擦角
    cohesion.grid(row=0, column=4, padx=2, pady=10, sticky='e')  #有效粘聚力
    permeability.grid(row=1, column=1, padx=2, pady=2, sticky='w')  #岩体饱和渗透系数
    mass_density.grid(row=1, column=4, padx=2, pady=10, sticky='e')  #岩体饱和重度

    #定义执行安全系数计算的按钮
    run_frame = tk.Frame(Frame, bg='#ffffff', padx=0, pady=0)
    run_frame.pack(fill=tk.BOTH)

    #将定义执行安全系数计算的按钮与反倾边坡稳定性分析模块类方法进行绑定实现方法的调用
    Run_btn = tk.Button(run_frame, text='运行计算FOS', bg='#ffffff',
                        command=lambda: anti(melt_duration, slope_angle, anti_angle, ice_thickness,
                                                slope_height, layer_width, cohesion, friction_angle,
                                                mass_density, permeability).run())
    Run_btn.pack(anchor=tk.CENTER)  #显示执行按钮

#创建三维楔形滑体边坡稳定性分析操作界面的函数
def create_wedge(Frame, text):  #Frame:软件界面对象, text:软件界面名称
    #定义界面的背景颜色、名称及其字体与大小
    tk.Label(Frame, text=text, border=5, anchor=tk.CENTER, foreground='black', bg="#FBE5D6",
             font=('宋体', 16), width=40).pack(padx=5,
                                               pady=5)
    #定义加载图片的区域
    Frame_pic = tk.Frame(Frame)
    Frame_pic.pack(anchor=tk.N, padx=5, pady=5)

    #打开软件界面要加载的图片
    img = Image.open(r'.\img\wedge_slide.png')
    width, height = img.width, img.height
    resized_img = img.resize((width, height), Image.LANCZOS)
    tk_img = ImageTk.PhotoImage(resized_img)

    #加载软件界面要加载的图片
    photo_label = tk.Label(Frame_pic, image=tk_img)
    photo_label.image = tk_img
    photo_label.pack(side=tk.LEFT, fill=tk.Y)

    #定义输入几何参数的区域
    Frame_para_geo = tk.LabelFrame(Frame, text='几何与时间参数', foreground='black', bg="#F2F2F2",
                                   font=('宋体', 16), labelanchor='n', relief='ridge')
    Frame_para_geo.pack(anchor=tk.N, padx=5, pady=5, fill='both')

    #在定义输入几何参数的区域内布局参数输入的窗口名称
    widget_frame1(Frame_para_geo, 16, '法向量', 'N1', '(xyz): ', '1.0', '1.3', '1.5', '1.12', 0, 0)
    widget_frame2(Frame_para_geo, 19, '初始冰厚度', '(h', '冰', ' m): ', '1.0', '1.5', '1.7', '1.8', '1.13', 0, 3)
    widget_frame1(Frame_para_geo, 15, '面积', 'A (m^2)', ': ', '1.0', '1.2', '1.9', '1.11', 1, 0)
    widget_frame2(Frame_para_geo, 19, '边坡高度', '(h', '边坡', ' m): ', '1.0', '1.4', '1.6', '1.8', '1.13', 1, 3)
    widget_frame1(Frame_para_geo, 13, '融冰时长', '(t h)', ': ', '1.0', '1.4', '1.9', '1.11', 2, 0)
    widget_frame1(Frame_para_geo, 12, '坡角度', '(α °)', ': ', '1.0', '1.3', '1.8', '1.11', 2, 3)
    widget_frame1(Frame_para_geo, 15, '裂隙/中线', '(Ra)', ': ', '1.0', '1.5', '1.9', '1.11', 3, 0)

    #定义接收对应几何参数窗口的位置布局
    norm_vector1 = tk.Entry(Frame_para_geo, width=10)  #楔形体单侧底面法向量
    ice_thickness = tk.Entry(Frame_para_geo, width=10)  #冰层厚度
    slope_height = tk.Entry(Frame_para_geo, width=10)  #边坡高度
    slide_area = tk.Entry(Frame_para_geo, width=10)  #楔形体单侧底面面积
    melt_duration = tk.Entry(Frame_para_geo, width=10)  #融冰时长
    slope_angle = tk.Entry(Frame_para_geo, width=10)  #坡度角
    ratio = tk.Entry(Frame_para_geo, width=10)  #裂隙长度与楔体底部中线长度比值

    #定义接收对应几何参数窗口的位置布局
    norm_vector1.grid(row=0, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #楔形体单侧底面法向量
    ice_thickness.grid(row=0, column=4, padx=2, pady=2, sticky='e')  #冰层厚度
    slide_area.grid(row=1, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #边坡高度
    slope_height.grid(row=1, column=4, padx=2, pady=2, sticky='e')  #楔形体单侧底面面积
    melt_duration.grid(row=2, column=1, columnspan=2, padx=2, pady=2, sticky='w')  #融冰时长
    slope_angle.grid(row=2, column=4, padx=2, pady=2, sticky='e')  #坡度角
    ratio.grid(row=3, column=1, padx=2, pady=2, sticky='w')  #裂隙长度与楔体底部中线长度比值

    #定义输入力学参数的区域
    Frame_para_mech = tk.LabelFrame(Frame, text='力学参数', foreground='black', bg="#F2F2F2", font=('宋体', 16),
                                    labelanchor='n', relief='ridge')
    Frame_para_mech.pack(anchor=tk.N, padx=5, pady=5)

    #在定义输入力学参数的区域内布局参数输入的窗口名称
    widget_frame1(Frame_para_mech, 20, '有效内摩擦角', "(φ' °)", ': ', '1.0', '1.6', '1.12', '1.14', 0, 0)
    widget_frame1(Frame_para_mech, 20, '有效内聚力', "(c' kPa)", ': ', '1.0', '1.5', '1.12', '1.14', 0, 3)
    widget_frame1(Frame_para_mech, 20, '饱和渗透系数', '(Ks)', ': ', '1.0', '1.6', '1.10', '1.12', 1, 0)
    widget_frame1(Frame_para_mech, 20, '岩体重度', '(γ', ' kN/m^3): ', '1.0', '1.4', '1.6', '1.16',  1, 3)

    #在定义输入力学参数的区域内布局接收对应参数的窗口
    friction_angle = tk.Entry(Frame_para_mech, width=8)  #有效内摩擦角
    cohesion = tk.Entry(Frame_para_mech, width=8)  #有效粘聚力
    permeability = tk.Entry(Frame_para_mech, width=8)  #岩体饱和渗透系数
    mass_density = tk.Entry(Frame_para_mech, width=8)  #岩体饱和重度

    #定义接收对应力学参数窗口的位置布局
    friction_angle.grid(row=0, column=1, padx=2, pady=2, sticky='w')  #有效内摩擦角
    cohesion.grid(row=0, column=4, padx=2, pady=10, sticky='e')  #有效粘聚力
    permeability.grid(row=1, column=1, padx=2, pady=2, sticky='w')  #岩体饱和渗透系数
    mass_density.grid(row=1, column=4, padx=2, pady=10, sticky='e')  #岩体饱和重度

    #定义执行安全系数计算的按钮
    run_frame = tk.Frame(Frame, bg='#ffffff', padx=0, pady=0)
    run_frame.pack(fill=tk.BOTH)

    #将定义执行安全系数计算的按钮与三维楔形滑体边坡稳定性分析模块类方法进行绑定实现方法的调用
    Run_btn = tk.Button(run_frame, text='运行计算FOS', bg='#ffffff',
                        command=lambda: wedge(norm_vector1, ice_thickness, slope_height,
                                              slide_area, melt_duration, slope_angle,
                                              cohesion, friction_angle, permeability, mass_density, ratio).run())
    Run_btn.pack(anchor=tk.CENTER)  #显示执行按钮


#创建软件操作界面画布
Frame_bedding=tk.Frame(root)  #创建顺层边坡稳定性分析操作界面画布于软件操作界面画布root上
Frame_antislope=tk.Frame(root)  #创建反倾边坡稳定性分析操作界面画布于软件操作界面画布root上
Frame_wedge=tk.Frame(root)  #创建三维楔形滑体边坡稳定性分析操作界面画布于软件操作界面画布root上
Frame_bedding.pack()  #显示顺层边坡稳定性分析操作界面画布于软件操作界面画布root上

create_bedding(Frame_bedding, '顺层边坡稳定性分析')  #调用函数创建顺层边坡稳定性分析操作界面内的布局
create_anti(Frame_antislope, '反倾边坡稳定性分析')  #调用函数创建反倾边坡稳定性分析操作界面内的布局
create_wedge(Frame_wedge, '楔形滑体边坡稳定性分析')  #调用函数创建三维楔形滑体边坡稳定性分析操作界面内的布局


bottom_frame = tk.Frame(root, padx=5, pady=5)  #在软件操作界面底部创建切换按钮区域
bottom_frame.place(relx=0.18, rely=0.94)  #设置底部切换按钮区域的位置
bedding_btn = tk.Button(bottom_frame, text='顺层', width=10)  #创建顺层边坡稳定性分析操作界面的切换按钮
antislope_btn = tk.Button(bottom_frame, text='反倾', width=10)  #创建反倾边坡稳定性分析操作界面的切换按钮
wedge_btn = tk.Button(bottom_frame, text='楔形', width=10)  #创建三维楔形滑体边坡稳定性分析操作界面的切换按钮

bedding_btn.pack(side=tk.LEFT, anchor=tk.CENTER)  #显示顺层边坡稳定性分析操作界面的切换按钮
antislope_btn.pack(side=tk.LEFT, anchor=tk.CENTER)  #显示反倾边坡稳定性分析操作界面的切换按钮
wedge_btn.pack(side=tk.RIGHT, anchor=tk.CENTER)  #显示三维楔形滑体边坡稳定性分析操作界面的切换按钮


#定义顺层边坡稳定性分析操作界面切换按钮功能的函数
def sure1():
    Frame_bedding.pack()
    Frame_antislope.pack_forget()
    Frame_wedge.pack_forget()

#定义反倾边坡稳定性分析操作界面切换按钮功能的函数
def sure2():
    Frame_bedding.pack_forget()
    Frame_antislope.pack()
    Frame_wedge.pack_forget()

#定义三维楔形滑体边坡稳定性分析操作界面切换按钮功能的函数
def sure3():
    Frame_bedding.pack_forget()
    Frame_antislope.pack_forget()
    Frame_wedge.pack()

#将各个操作界面切换按钮与其对应的功能函数绑定
bedding_btn.config(command=sure1)
antislope_btn.config(command=sure2)
wedge_btn.config(command=sure3)


root.mainloop()  #显示程序的操作界面