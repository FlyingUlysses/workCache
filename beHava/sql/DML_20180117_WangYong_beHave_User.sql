set @excelId =(SELECT id from excels where busiType = 'beHave_User');
set @templateTemp =(SELECT template from excel_parts where excel_id = @excelId);
DELETE FROM excel_cells WHERE template = @templateTemp;
DELETE FROM excel_parts where excel_id = @excelId;
DELETE from excels WHERE busiType = 'beHave_User';


INSERT INTO `ngms`.`excels` (`busiType`, `name`, `state`, `desc`, `create_time`) VALUES ('beHave_User', '导出用户某日软件使用记录', '1', '', '2018-01-17 09:22:46');

set @excelId =(SELECT LAST_INSERT_ID());
set @templateTemp =((SELECT max(template) from ngms.excel_parts) +1);

INSERT INTO `ngms`.`excel_parts` (`excel_id`, `name`, `isFixed`, `sheet`, `sheet_sql`, `data_sql`, `sort`, `state`, `create_time`, `update_time`, `template`, `data_tables`, `sheet_tables`) VALUES ( @excelId, '导出用户某日软件使用记录', '1', '', 'SELECT id,name from base_user u where state =1', 'SELECT la.id,la.ipaddress,la.remarks,la.action,DATE_FORMAT(la.create_time,\'%Y-%m-%d %H:%i:%s\')create_time, la.org_id, u.name user_name, la.userId user_id,la.busitype,\r\n(select deviceModel from base_mobiles bm where la.plat =2 and  bm.deviceId = la.deviceId) model,\r\n(case when la.plat =1 then \'PC端\' when la.plat =2 then \'手机端\' end) plat_name\r\n FROM log_apps la left join base_org o on o.id = la.org_id left join base_user u on u.id = la.userId where true #filter and la.userId = #id order by create_time desc', '1', '1', '2018-01-16 15:52:23', '2018-01-17 13:56:42', @templateTemp, '', '');


INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '用户软件使用记录', NULL, '500', '0', '0', 'Y', '0', '6', '', '', NULL, '', NULL, NULL, '', '', '');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '用户名称', '4500', NULL, '1', '0', 'Y', '2', '0', '', '', NULL, '', NULL, NULL, '', '', 'user_name');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '访问方式', '4500', NULL, '1', '1', 'Y', '2', '1', '', '', NULL, '', NULL, NULL, '', '', 'plat_name');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '设备型号', '4500', NULL, '1', '2', 'Y', '2', '2', '', '', NULL, '', NULL, NULL, '', '', 'model');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '业务编码', '4500', NULL, '1', '3', 'Y', '2', '3', '', '', NULL, '', NULL, NULL, '', '', 'busitype');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '创建时间', '4500', NULL, '1', '4', 'Y', '2', '4', '', '', NULL, '', NULL, NULL, '', '', 'create_time');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, 'ip地址', '4500', NULL, '1', '5', 'Y', '2', '5', '', '', NULL, '', NULL, NULL, '', '', 'ipaddress');
INSERT INTO `ngms`.`excel_cells` ( `part_id`, `template`, `cellname`, `width`, `height`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`, `border`, `autoWrap`, `bgColor`, `fontName`, `fontColor`, `fontSize`, `fontBold`, `native_name`, `property`) VALUES ( NULL, @templateTemp, '备注', '4500', NULL, '1', '6', 'Y', '2', '6', '', '', NULL, '', NULL, NULL, '', '', 'remarks');


