using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using ERPReports.Models;

namespace ERPReports.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        List<string> modelErrors = new List<string>();
        string errmsg;

        // GET: Login
        public ActionResult Index()
        {
            if (Session["ID"] != null)
            {
                return RedirectToAction("Index", "Home", new { area = "" });
            }
            else
            {
                return View("Login");
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LoginEntry(Login data)
        {
            try
            {
                Security ph = new Security();
                int ID = 0;
                bool isApprover = false;
                string Username = "";
                string Email = "";
                string Department = "";
                string Name = "";
                string username = data.Username;
                string password = ph.base64Encode(data.Password.ToString());

                DataHelper dataHelper = new DataHelper();

                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["ERPReports"].ConnectionString.ToString()))
                {
                    conn.Open();
                    using (SqlCommand cmdSql = conn.CreateCommand())
                    {
                        cmdSql.CommandType = CommandType.StoredProcedure;
                        cmdSql.CommandText = "User_Login";

                        cmdSql.Parameters.Clear();
                        cmdSql.Parameters.AddWithValue("@Username", username);
                        cmdSql.Parameters.AddWithValue("@Password", password);

                        using (SqlDataReader rdSql = cmdSql.ExecuteReader())
                        {
                            if (rdSql.Read())
                            {
                                ID = Convert.ToInt32(rdSql["ID"]);
                                Username = rdSql["Username"].ToString();
                                Name = rdSql["FirstName"].ToString() + " " + rdSql["LastName"].ToString();
                                Email = rdSql["Email"].ToString();
                                Department = rdSql["Department"].ToString();
                                isApprover = Convert.ToBoolean(rdSql["PostFunction_Approver"]);

                                Session["ID"] = ID;
                                Session["Username"] = Username;
                                Session["Name"] = Name;
                                Session["Email"] = Email;
                                Session["Department"] = Department;
                                Session["IsApprover"] = isApprover;
                            }
                            else
                            {
                                errmsg = "Invalid Username or Password. Please try again.";
                            }
                        }
                    }
                }
            }
            catch (Exception err)
            {
                if (err.InnerException != null)
                    errmsg = "Error: " + err.InnerException.ToString();
                else
                    errmsg = "Error: " + err.Message.ToString();
            }
            if (errmsg != null)
                return Json(new { success = true, data = new { error = true, errmsg = errmsg } });
            else
            {
                return Json(new { success = true, data = new { error = false } });
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Logout(int ID)
        {
            Session.Abandon();
            return RedirectToAction("Index", "Login", new { area = "" });
        }
        public ActionResult SessionError()
        {
            return Json(new { success = false, type = "Login", errors = "Session has expired. Please login again. Thank you." }, JsonRequestBehavior.AllowGet);
        }
    }
}
