using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class CapitulosdeObrasController : Controller
    {
        // GET: Modulos
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string clave, string capitulo, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<CapitulosdeObra> query = db.CapitulosdeObra;

            if (!string.IsNullOrEmpty(clave))
                query = query.Where(i => (i.Clave).Contains(clave));
            if (!string.IsNullOrEmpty(capitulo))
                query = query.Where(i => (i.Capitulo).Contains(capitulo));

            return Json(new
            {
                total = query.Count(),
                datos = query
                     .OrderBy(i => new { i.Clave })
                     .Select(i => new {
                         id = i.CapituloObraID,
                         clave = i.Clave,
                         nombre = i.Capitulo,
                     }).ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            CapitulosdeObra cap = db.CapitulosdeObra.FirstOrDefault(i => i.CapituloObraID == id);

            CapitulosdeObra c = new CapitulosdeObra();

            if (cap != null)
            {
                c.CapituloObraID = cap.CapituloObraID;
                c.Clave = cap.Clave;
                c.Capitulo = cap.Capitulo;
            }

            return PartialView("_Formulario", c);
        }

        [HttpPost]
        public JsonResult Create(CapitulosdeObra cap)
        {
            try
            {
                cap.Crear();
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
        public JsonResult Edicion(CapitulosdeObra cap)
        {
            try
            {
                cap.Editar();
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
                CapitulosdeObra cap = new CapitulosdeObra();
                cap.Eliminar(id);
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

        [HttpGet]
        public JsonResult ModulosUsuario(string usuario)
        {

            SISECOOBEntities db = new SISECOOBEntities();

            var menus = db.Menu
                          .Where(i => i.Nivel == 0)
                          .OrderBy(i => new { i.Nombre })
                          .Select(i => new
                          {
                              menuid = i.MenuID,
                              nombre = i.Nombre,
                              nivel = i.Nivel,
                              selected = db.Menu_Usuarios.Any(j => j.MenuID_Fk == i.MenuID && j.Usuario_Id == usuario),
                              hijos = db.Menu.Where(e => e.Padre == i.MenuID).OrderBy(e => new { e.Nombre })
                              .Select(e => new
                              {
                                  menuid = e.MenuID,
                                  nombre = e.Nombre,
                                  nivel = e.Nivel,
                                  selected = db.Menu_Usuarios.Any(j => j.MenuID_Fk == e.MenuID && j.Usuario_Id == usuario),
                                  hijos = db.Menu.Where(m => m.Padre == e.MenuID).OrderBy(m => new { e.Nombre })
                                  .Select(m => new
                                  {
                                      menuid = m.MenuID,
                                      nombre = m.Nombre,
                                      nivel = m.Nivel,
                                      selected = db.Menu_Usuarios.Any(j => j.MenuID_Fk == m.MenuID && j.Usuario_Id == usuario),
                                  })
                              })
                          }).ToList();

            return Json(new
            {
                datos = menus,
                total = menus.Count(),
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AgregarModulos(string usuario, int[] modulos)
        {
            try
            {
                Menu_Usuarios menu = new Menu_Usuarios();
                menu.Crear(usuario, modulos);
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