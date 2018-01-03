package com.yinos.gis.core.model;

import com.jfinal.plugin.activerecord.Model;

@SuppressWarnings("serial")
public class Token extends Model<Token> {

	public static final Token me = new Token();

	public Token getToken(String token) {
		return findFirst("select * from sys_tokens where token = ?", token);
	}
}