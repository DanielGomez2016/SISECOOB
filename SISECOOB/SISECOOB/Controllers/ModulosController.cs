using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class ModulosController : Controller
    {
        // GET: Modulos
        public ActionResult Index()
        {
            SISECOOBEntities db = new SISECOOBEntities();
            ViewBag.ModuloP = db.Menu.Where(i => i.Padre == 0).Select(i => new { id = i.MenuID, nombre = i.Nombre }).ToList();
            return View();
        }

        public JsonResult Buscar(string nombre, int padre = 0, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Menu> query = db.Menu;

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(i => (i.Nombre).Contains(nombre));
            if (padre > 0)
                query = query.Where(i => i.Padre == padre);

            return Json(new
            {
                total = query.Count(),
                datos = query
                     .OrderBy(i => new { i.Padre })
                     .Select(i => new {
                         id = i.MenuID,
                         nivel = db.Menu.Where(j => j.Padre == i.MenuID).Count(),
                         nombre = i.Nombre,
                         direccion = i.Controlador + "/" + i.Direccion,
                         padre = db.Menu.Where(j => j.MenuID == i.Padre).Select(j => j.Nombre),
                     }).ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Menu menu = db.Menu.FirstOrDefault(i => i.MenuID == id);

            ViewBag.ModuloP = db.Menu.Where(i => i.Padre == 0).Select(i => new { id = i.MenuID, nombre = i.Nombre }).ToList();

            Menu m = new Menu();

            if (menu != null)
            {
                m.MenuID = menu.MenuID;
                m.Nombre = menu.Nombre;
                m.Direccion = menu.Direccion;
                m.Controlador = menu.Controlador;
                m.Padre = menu.Padre;
                m.Nivel = menu.Nivel;
            }

            return PartialView("_Formulario", m);
        }

        [HttpPost]
        public JsonResult Create(Menu menu)
        {
            try
            {
                menu.Crear();
                return Json(new
                {
                    result = true
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    result = false,
                    message = e.Message
                });
            }
        }

        [HttpPost]
        public JsonResult Edicion(Menu menu)
        {
            try
            {
                menu.Editar();
                return Json(new
                {
                    result = true
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    result = false,
                    message = e.Message
                });
            }
        }

        [HttpPost]
        public JsonResult Elimina(int id = 0)
        {
            try
            {
                Menu menu = new Menu();
                menu.Eliminar(id);
                return Json(new
                {
                    result = true
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    result = false,
                    message = e.Message
                });
            }
        }
    }
}