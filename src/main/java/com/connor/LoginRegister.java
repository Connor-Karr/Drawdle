package com.connor;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.catalina.User;


@WebServlet("/loginRegister")
public class LoginRegister extends HttpServlet {
	private static final long serialVersionUID = 1L;


	public LoginRegister() {
		super();

	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("\nIn loginRegister");
		
		LoginDAO cd = new LoginDAOImpl();
		//session.getAttribute();
		String username = request.getParameter("username");
		String password = request.getParameter("password1");
		String submitType = request.getParameter("submit");	
		HttpSession session = request.getSession();
		
		System.out.println("username is "+ session.getAttribute("user"));
		System.out.println("password is "+ session.getAttribute("pwrd"));
		
		
		if (session.getAttribute("usernames")==null ) {
			if(submitType.equals("Register")) {
				boolean tester = true;
				String password2 = request.getParameter("password2");
				if(cd.isLogin(username)==false || username.length()<5) {
					System.out.println("Username Checker");
					String userproblem = "Your Username ";
					if(cd.isLogin(username)==false) {
						userproblem+= "is in use";
					}
					if(cd.isLogin(username)==false && username.length()<5) {
						userproblem+= " and ";
					}
					if(username.length()<5) {
						userproblem+= "needs to be at least five characters";
					}
					request.setAttribute("userReq1", userproblem);
					tester=false;
				}

				if(password.length()<8||password2.length()<8) {
					request.setAttribute("passwordReq", "Your Password needs to be at least eight characters");

					tester=false;
				}
				if(!password.equals(password2)) {
					request.setAttribute("retypeProb", "Your Passwords do not match");
					tester=false;
				}

				if(tester) {
					Login c = cd.getLogin(username, password);
					c.setPassword(password);
					c.setUsername(username);
					cd.insertLogin(c);
					response.sendRedirect("/Drawdle/login.jsp");
				}


				else {
					request.getRequestDispatcher("Register.jsp").forward(request, response);
				}
			}
			else if(submitType.equals("Login")) {
				boolean tester2 = true;
				Login c = cd.getLogin(username, password);
				if(cd.isLogin(username)) {
					request.setAttribute("userReq", "Your Username is inncorrect");
					tester2=false;
				}
				if(c.getUsername()==null && c.getPassword()==null) {
					request.setAttribute("totalerror", "Your Password is Inncorrect");
					tester2=false;
				}
				if(tester2) {
					System.out.println("Go to Drawing Screen and cookies and session");
					Cookie cook = new Cookie("username", username);
					response.addCookie(cook);
					cook.setMaxAge(3000);
					session = request.getSession(true);
					session.setAttribute("user", username);
					session.setAttribute("pwrd", password);
					response.sendRedirect("/Drawdle/dashboard.jsp");
					
				}
				else {
					request.getRequestDispatcher("login.jsp").forward(request, response);

				}

			}

			else if(submitType.equals("Register Here")) {
				response.sendRedirect("/Drawdle/Register.jsp");
			}
			else if(submitType.equals("Back")) {
				response.sendRedirect("/Drawdle/login.jsp");
			}
		}
		else {
			System.out.println("Go to Drawing Screen");
			response.sendRedirect("/Drawdle/dashboard.jsp");
		}



	}

}

