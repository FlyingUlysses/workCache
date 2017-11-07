ALTER TABLE `excel_parts`
DROP COLUMN `name`,
DROP COLUMN `isFixed`,
DROP COLUMN `sheet`,
DROP COLUMN `data_tables`,
DROP COLUMN `sheet_tables`;

ALTER TABLE `excel_parts`
ADD COLUMN `name`  varchar(64) CHARACTER SET utf8 NOT NULL COMMENT '模板名称' AFTER `excel_id`,
ADD COLUMN `isFixed`  int(1) NOT NULL COMMENT '是否固定 1 固定 2 非固定' AFTER `name`,
ADD COLUMN `sheet`  varchar(64) CHARACTER SET utf8 NULL COMMENT '固定 sheet 页名称' AFTER `isFixed`,
ADD COLUMN `data_tables`  varchar(255) CHARACTER SET utf8 NULL COMMENT 'dataSql的来源表格、别名、连接关系' AFTER `template`,
ADD COLUMN `sheet_tables`  varchar(255) CHARACTER SET utf8 NULL COMMENT 'sheetSql中的表格关系' AFTER `data_tables`;

ALTER TABLE `excel_cells`
DROP COLUMN `native_name`;

ALTER TABLE `excel_cells`
ADD COLUMN `native_name`  varchar(64) CHARACTER SET utf8 NULL COMMENT '实体字段全称' AFTER `property`;

