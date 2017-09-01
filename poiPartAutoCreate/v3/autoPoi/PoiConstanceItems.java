package com.yawa.util.autoPoi;
/**
 *@Title:poi报表模块自动生成 静态常量类
 *@Description:
 *@Author:WangYong
 *@Since:2017-8-15
 *@Version:1.1.0
 */
public class PoiConstanceItems {
    public static final String TABLE_SCHEMA="ngms";
    public static final String SHEET_SQL="select #id id,#name name from #tableName  ";
    public static final String DATA_SQL="select #columns from #baseTable   #joinTable  where #sheet=#id #filter ";
}
