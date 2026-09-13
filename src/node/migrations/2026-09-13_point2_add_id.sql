-- 2026-09-13
-- 背景：point2 表原设计没有主键，无法定位并删除单条点位记录。
-- “查看全部点 / 删除点”功能依赖 id 主键，部署到其它数据库时请执行一次本脚本。
-- 幂等：重复执行不会报错、不会重复新增列。
ALTER TABLE point2 ADD COLUMN IF NOT EXISTS id serial PRIMARY KEY;

-- 备注：point2.geom 实际类型为 character varying，
-- 查询接口已统一使用 ST_X(geom::geometry) / ST_Y(geom::geometry) 转换，无需修改列类型。