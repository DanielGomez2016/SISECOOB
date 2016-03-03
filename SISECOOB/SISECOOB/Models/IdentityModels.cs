using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentitySample.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {

        public string Nombre { get; set; }

        [Display(Name = "Apellido Paterno")]
        public string aPaterno { get; set; }

        [Display(Name = "Apellido Materno")]
        public string aMaterno { get; set; }

        public int Supervisor { get; set; }

        public int Activo { get; set; }

        public int Zona { get; set; }

        public string DisplayName
        {
            get
            {
                string nom =
                    string.IsNullOrWhiteSpace(this.Nombre) ? "" : this.Nombre;
                string ap =
                    string.IsNullOrWhiteSpace(this.aPaterno) ? "" : this.aPaterno;
                string am =
                    string.IsNullOrWhiteSpace(this.aMaterno) ? "" : this.aMaterno;

                return string
                    .Format("{0} {1} {2} {3}", nom, ap, am);
            }
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        static ApplicationDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            Database.SetInitializer<ApplicationDbContext>(new ApplicationDbInitializer());
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}