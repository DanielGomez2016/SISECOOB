using IdentitySample.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using SISECOOB.Models;

namespace IdentitySample.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class UsersAdminController : Controller
    {
        public UsersAdminController()
        {
        }

        public UsersAdminController(ApplicationUserManager userManager, ApplicationRoleManager roleManager)
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        private ApplicationRoleManager _roleManager;
        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.GetOwinContext().Get<ApplicationRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }

        //
        // GET: /Users/
        public ActionResult Index()
        {
            ViewBag.RoleNames = RoleManager.Roles.ToList().Select(i => new { nombre = i.Name });
            List<ItemZona> item = new List<ItemZona>();
            item.Add(new ItemZona(0, "Chihuahua",""));
            item.Add(new ItemZona(1, "Juarez",""));

            ViewBag.Zonas = item;
            var a = item;
            return View();
        }

        public JsonResult Buscar(string email, string nombre, int? Zona, int page = 1, int pageSize = 15)
        {
            ApplicationDbContext db = new ApplicationDbContext();

            IQueryable<IdentitySample.Models.ApplicationUser> query = UserManager.Users;

            if (!string.IsNullOrEmpty(email))
                query = query.Where(i => i.Email.Contains(email));

            if (!string.IsNullOrEmpty(email))
                query = query.Where(i => i.UserName.Contains(email));

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(i => (i.Nombre + " " + i.aPaterno + " " + i.aMaterno).Contains(email));

            if (Zona == 0 || Zona == 1)
                query = query.Where(i => i.Zona == Zona);

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.UserName)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.Id,
                                 Nombre = i.Nombre,
                                 ApellidoP = i.aPaterno,
                                 ApellidoM = i.aMaterno,
                                 Email = i.Email,
                                 UserName = i.UserName,
                                 Rol = UserManager.GetRoles(i.Id),
                                 Zona = i.Zona,
                                 Activo = i.Activo,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        //
        // GET: /Users/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);

            ViewBag.RoleNames = await UserManager.GetRolesAsync(user.Id);

            return View(user);
        }


        [HttpPost]
        public ActionResult Formulario()
        {
            //Get the list of Roles
            List<ItemZona> item = new List<ItemZona>();
            item.Add(new ItemZona(0, "Chihuahua",""));
            item.Add(new ItemZona(1, "Juarez",""));

            ViewBag.Zonas = item;
            return PartialView("_Create");
        }


        [HttpPost]
        public JsonResult Create(RegisterViewModel userViewModel)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = userViewModel.Email.Substring(0, userViewModel.Email.Length - 17),
                    Email = userViewModel.Email,
                    Nombre = userViewModel.Nombre,
                    aPaterno = userViewModel.aPaterno,
                    aMaterno = userViewModel.aMaterno,
                    Supervisor = userViewModel.Supervisor,
                    Zona = userViewModel.Zona,
                    Activo = userViewModel.Activo
                };

                user.Nombre = userViewModel.Nombre;
                user.aPaterno = userViewModel.aPaterno;
                user.aMaterno = userViewModel.aMaterno;
                user.Supervisor = userViewModel.Supervisor;
                user.Zona = userViewModel.Zona;
                user.Activo = 1;

                var adminresult = UserManager.Create(user, userViewModel.Password);

                //Add User to the selected Roles 
                if (adminresult.Succeeded)
                {
                    return Json(new
                    {
                        result = true
                    });
                }
                else
                {
                    return Json(new
                    {
                        result = false
                    });

                }
                
            }
            return Json(new
            {
                result = false
            });
        }

        [HttpPost]
        public ActionResult EditandoUsuario(string id)
        {

            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = UserManager.FindById(id);
            if (user == null)
            {
                return HttpNotFound();
            }

            //var userRoles = UserManager.GetRoles(user.Id);

            EditUserViewModel usuario = new EditUserViewModel();

            usuario.Id = user.Id;
            usuario.Email = user.Email != null ? user.Email : "";
            usuario.Nombre = user.Nombre != null ? user.Nombre : "";
            usuario.aPaterno = user.aPaterno != null ? user.aPaterno : "";
            usuario.aMaterno = user.aMaterno != null ? user.aMaterno : "";
            usuario.Zona = user.Zona;


            List<ItemZona> item = new List<ItemZona>();
            item.Add(new ItemZona(0, "Chihuahua", usuario.Zona == 0 ? "checked" : ""));
            item.Add(new ItemZona(1, "Juarez", usuario.Zona == 1 ? "checked" : ""));

            ViewBag.Zonas = item;
            //RolesList = RoleManager.Roles.ToList().Select(x => new SelectListItem()
            //{
            //    Selected = userRoles.Contains(x.Name),
            //    Text = x.Name,
            //    Value = x.Name
            //})

            return PartialView("_EditandoUsuario",usuario);
        }
        //
        // POST: /Users/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Email,Id,Nombre,aPaterno,aMaterno,Zona,Activo")] EditUserViewModel editUser)
        {


            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByIdAsync(editUser.Id);
                if (user == null)
                {
                    return HttpNotFound();
                }

                user.UserName = editUser.Email.Substring(0, editUser.Email.Length - 17) == ""?editUser.Email:editUser.Nombre + "." + editUser.aPaterno;
                user.Email = editUser.Email;
                user.Nombre = editUser.Nombre;
                user.aPaterno = editUser.aPaterno;
                user.aMaterno = editUser.aMaterno;
                user.Zona = editUser.Zona;
                user.Activo = editUser.Activo;


                var result = UserManager.Update(user);

                if (result.Succeeded)
                {
                    return Json(new
                    {
                        result = true
                    }
                    );
                }
                else {
                    return Json(new
                    {
                        result = false
                    }
                );
                }
                
            }
            return Json(new {
                    result = false}
                ); 
        }

        //
        // GET: /Users/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        //
        // POST: /Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            if (ModelState.IsValid)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }

                var user = await UserManager.FindByIdAsync(id);
                if (user == null)
                {
                    return HttpNotFound();
                }
                var result = await UserManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                return RedirectToAction("Index");
            }
            return View();
        }
    }
}
