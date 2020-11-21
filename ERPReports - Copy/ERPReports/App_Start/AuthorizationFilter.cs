using System;
//using ERPReports.Areas.MasterMaintenance.Models;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;
namespace ERPReports.App_Start
{
    public class AuthorizationFilter : AuthorizeAttribute, IAuthorizationFilter
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            ArrayList userMenuList = new ArrayList();
            HttpContext context = HttpContext.Current;
            context.Session["Menu"] = "";
            if (filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true)
                || filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true))
            {
                return;
            }
            if (context.Session["ID"] == null)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "SessionError" }, { "controller", "Login" }, { "area", "" } });
                }
                else
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "Index" }, { "controller", "Login" }, { "area", "" } });
                }
            }
            else
            {

                string userID = context.Session["ID"].ToString();
                string URL = context.Request.RawUrl;
                bool error = false;

                try
                {
                    using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["ERPReports"].ConnectionString.ToString()))
                    {
                        conn.Open();
                        using (SqlCommand cmdSql = conn.CreateCommand())
                        {
                            cmdSql.CommandType = CommandType.StoredProcedure;
                            cmdSql.CommandText = "UserPageAccess_Validate";

                            cmdSql.Parameters.Clear();
                            cmdSql.Parameters.AddWithValue("@UserID", userID);
                            cmdSql.Parameters.AddWithValue("@PURL", URL);
                            SqlParameter ErrorMessage = cmdSql.Parameters.Add("@ErrorMessage", SqlDbType.VarChar, 200);
                            SqlParameter Error = cmdSql.Parameters.Add("@Error", SqlDbType.Bit);
                            Error.Direction = ParameterDirection.Output;
                            ErrorMessage.Direction = ParameterDirection.Output;

                            cmdSql.ExecuteNonQuery();

                            error = Convert.ToBoolean(Error.Value);
                            if (error)
                            {
                                //context.Response.StatusCode = 403;
                                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "action", "Error403" }, { "controller", "Error" }, { "area", "" } });
                            }
                            else
                            {
                                using (SqlDataReader sdr = cmdSql.ExecuteReader())
                                {
                                    while (sdr.Read())
                                    {
                                        //var userid = Session["UserID"].ToString();
                                        userMenuList.Add(new
                                        {
                                            ID = Convert.ToInt32(sdr["ID"]),
                                            GroupLabel = sdr["GroupLabel"].ToString(),
                                            PageName = sdr["PageName"].ToString(),
                                            PageLabel = sdr["PageLabel"].ToString(),
                                            URL = sdr["URL"].ToString(),
                                            HasSub = Convert.ToInt32(sdr["HasSub"]),
                                            ParentMenu = sdr["ParentMenu"].ToString(),
                                            ParentOrder = Convert.ToInt32(sdr["ParentOrder"]),
                                            Order = Convert.ToInt32(sdr["Order"]),
                                            Icon = sdr["Icon"].ToString(),
                                            ReadAndWrite = sdr["ReadAndWrite"].ToString(),
                                            DeleteEnabled = sdr["DeleteEnabled"].ToString(),
                                        });
                                    }
                                }
                                var jsonSerialiser = new JavaScriptSerializer();
                                var json = jsonSerialiser.Serialize(userMenuList);
                                context.Session["Menu"] = json;
                            }
                        }
                        conn.Close();
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }
    }
}
