package com.yinos.gis.core.model;

import com.jfinal.plugin.activerecord.Model;

@SuppressWarnings("serial")
public class Base extends Model<Base> {

	public static final Base me = new Base();
	
	public String getVal(String code){
	    return findFirst("select value from base where code = ?", code).getStr("value");
	}
}