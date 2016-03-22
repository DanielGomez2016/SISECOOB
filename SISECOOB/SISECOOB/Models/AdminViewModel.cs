using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace IdentitySample.Models
{
    public class RoleViewModel
    {
        public string Id { get; set; }
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "RoleName")]
        public string Name { get; set; }
    }

    public class EditUserViewModel
    {
        public string Id { get; set; }

        public string Nombre { get; set; }

        [Display(Name = "Apellido Paterno")]
        public string aPaterno { get; set; }

        [Display(Name = "Apellido Materno")]
        public string aMaterno { get; set; }

        public int Supervisor { get; set; }

        public int Activo { get; set; }

        public int Zona { get; set; }

        public string UserName { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }
        public string Rol { get; set; }

        public IEnumerable<SelectListItem> RolesList { get; set; }
    }
}