
using System.ComponentModel.DataAnnotations;

namespace ERPReports.Areas.MasterMaintenance.Models
{
    public class mUser
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Department is required")]
        public string Department { get; set; }
        public string DepartmentDesc { get; set; }

        [Required(ErrorMessage = "Post/Approver is required")]
        public int PostFunction_Approver { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; }
        public string CostCenterIDs { get; set; }
        public string UserCategory { get; set; }
    }
    public class User_CostCenter
    {
        public int CostCenterID { get; set; }
        public string CostCenterDescription { get; set; }
    }
}
