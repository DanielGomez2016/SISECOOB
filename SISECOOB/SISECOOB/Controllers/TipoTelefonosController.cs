using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class TipoTelefonosController : Controller
    {
        // GET: Municipios
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string tipo, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<TipoTelefono> query = db.TipoTelefono;

            if (!string.IsNullOrEmpty(tipo))
                query = query.Where(i => (i.TipoTelefono1).Contains(tipo));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.TipoTelefono1)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.TelefonoID,
                                 nombre = i.TipoTelefono1,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            TipoTelefono tip = db.TipoTelefono.FirstOrDefault(i => i.TelefonoID == id);
            TipoTelefono t = new TipoTelefono();

            if (tip != null)
            {
                t.TelefonoID = tip.TelefonoID;
                t.TipoTelefono1 = tip.TipoTelefono1;
            }

            return PartialView("_Formulario", t);
        }

        [HttpPost]
        public JsonResult Create(TipoTelefono tipos)
        {
            try
            {
                tipos.Crear();
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
        public JsonResult Edicion(TipoTelefono tipos)
        {
            try
            {
                tipos.Editar();
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
                TipoTelefono tipo = new TipoTelefono();
                tipo.Eliminar(id);
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
