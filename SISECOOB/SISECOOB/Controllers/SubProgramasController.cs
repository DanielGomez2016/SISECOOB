using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class SubProgramasController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string subprograma, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<SubProgramasEdu> query = db.SubProgramasEdu;

            if (!string.IsNullOrEmpty(subprograma))
                query = query.Where(i => (i.Subprograma).Contains(subprograma));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Subprograma)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.SubprogramaID,
                                 nombre = i.Subprograma,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            SubProgramasEdu subpro = db.SubProgramasEdu.FirstOrDefault(i => i.SubprogramaID == id);
            SubProgramasEdu sp = new SubProgramasEdu();

            if (subpro != null)
            {
                sp.Subprograma = subpro.Subprograma;
                sp.SubprogramaID = subpro.SubprogramaID;
            }

            return PartialView("_Formulario", sp);
        }

        [HttpPost]
        public JsonResult Create(SubProgramasEdu sub)
        {
            try
            {
                sub.Crear();
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
        public JsonResult Edicion(SubProgramasEdu sub)
        {
            try
            {
                sub.Editar();
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
                SubProgramasEdu subpro = new SubProgramasEdu();
                subpro.Eliminar(id);
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