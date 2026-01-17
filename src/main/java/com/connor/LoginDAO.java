package com.connor;

public interface LoginDAO {
	
	public int insertLogin(Login c);
	public Login getLogin(String username, String pass);
	public boolean isLogin(String user);
}
