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
        public async Task<ActionResult> Index()
        {
            ViewBag.RoleNames = RoleManager.Roles.ToList().Select(i => new { nombre = i.Name });
            List<ItemZona> item = new List<ItemZona>();
            item.Add(new ItemZona(0, "Chihuahua"));
            item.Add(new ItemZona(1, "Juarez"));

            ViewBag.Zonas = item;
            var a = item;
            return View(await UserManager.Users.ToListAsync());
        }

        public JsonResult Buscar(string userName, string rol, int? Zona, int page = 1, int pageSize = 15)
        {
            ApplicationDbContext db = new ApplicationDbContext();

            IQueryable<IdentitySample.Models.ApplicationUser> query = UserManager.Users;

            if (!string.IsNullOrEmpty(userName))
                query = query.Where(i => i.UserName.Contains(userName));
            //if (!string.IsNullOrEmpty(rol))
            //{
            //    string role = RoleManager.Roles.Where(i => i.Name == rol).Select(j => j.Id).ToString();
            //    string[] usuarios = UserManager.Users.Where(i => i.Roles.Where(j => j.RoleId == role).ToArray();
            //    query = query.Where(i => usuarios.Contains(i.UserName));
            //}
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

        //
        // GET: /Users/Create
        public async Task<ActionResult> Create()
        {
            //Get the list of Roles
            ViewBag.RoleId = new SelectList(await RoleManager.Roles.ToListAsync(), "Name", "Name");
            return View();
        }

        //
        // POST: /Users/Create
        [HttpPost]
        public async Task<ActionResult> Create(RegisterViewModel userViewModel, params string[] selectedRoles)
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
                user.Activo = userViewModel.Activo;

                var adminresult = await UserManager.CreateAsync(user, userViewModel.Password);

                //Add User to the selected Roles 
                if (adminresult.Succeeded)
                {
                    if (selectedRoles != null)
                    {
                        var result = await UserManager.AddToRolesAsync(user.Id, selectedRoles);
                        if (!result.Succeeded)
                        {
                            ModelState.AddModelError("", result.Errors.First());
                            ViewBag.RoleId = new SelectList(await RoleManager.Roles.ToListAsync(), "Name", "Name");
                            return View();
                        }
                    }
                }
                else
                {
                    ModelState.AddModelError("", adminresult.Errors.First());
                    ViewBag.RoleId = new SelectList(RoleManager.Roles, "Name", "Name");
                    return View();

                }
                return RedirectToAction("Index");
            }
            ViewBag.RoleId = new SelectList(RoleManager.Roles, "Name", "Name");
            return View();
        }

        //
        // GET: /Users/Edit/1
        public async Task<ActionResult> Edit(string id)
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

            var userRoles = await UserManager.GetRolesAsync(user.Id);

            return View(new EditUserViewModel()
            {
                Id = user.Id,
                Email = user.Email,
                Nombre = user.Nombre,
                aPaterno = user.aPaterno,
                aMaterno = user.aMaterno,
                Supervisor = user.Supervisor,
                Zona = user.Zona,
                Activo = user.Activo,
                RolesList = RoleManager.Roles.ToList().Select(x => new SelectListItem()
                {
                    Selected = userRoles.Contains(x.Name),
                    Text = x.Name,
                    Value = x.Name
                })
            });
        }

        //
        // POST: /Users/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Email,Id,Nombre,aPaterno,aMaterno,Supervisor,Activo,Zona")] EditUserViewModel editUser, params string[] selectedRole)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByIdAsync(editUser.Id);
                if (user == null)
                {
                    return HttpNotFound();
                }

                user.UserName = editUser.Email.Substring(0, '@');
                user.Email = editUser.Email;
                user.Nombre = editUser.Nombre;
                user.aPaterno = editUser.aPaterno;
                user.aMaterno = editUser.aMaterno;
                user.Supervisor = editUser.Supervisor;
                user.Zona = editUser.Zona;
                user.Activo = editUser.Activo;

                var userRoles = await UserManager.GetRolesAsync(user.Id);

                selectedRole = selectedRole ?? new string[] { };

                var result = await UserManager.AddToRolesAsync(user.Id, selectedRole.Except(userRoles).ToArray<string>());

                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                result = await UserManager.RemoveFromRolesAsync(user.Id, userRoles.Except(selectedRole).ToArray<string>());

                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());
                    return View();
                }
                return RedirectToAction("Index");
            }
            ModelState.AddModelError("", "Something failed.");
            return View();
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
