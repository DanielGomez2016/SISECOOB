using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class ConceptosController : Controller
    {
        // GET: Conceptos
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string clave, string concepto, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Conceptos> query = db.Conceptos;

            if (!string.IsNullOrEmpty(clave))
                query = query.Where(i => (i.Clave).Contains(clave));
            if (!string.IsNullOrEmpty(concepto))
                query = query.Where(i => (i.Concepto).Contains(concepto));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Clave)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.ConceptoId,
                                 clave = i.Clave,
                                 concepto = i.Concepto,
                                 desc = i.Descripcion,
                                 unidad = i.Unidad,
                                 precio = i.Precio,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Conceptos con = db.Conceptos.FirstOrDefault(i => i.ConceptoId == id);

            Conceptos c = new Conceptos();

            if (con != null)
            {
                c.ConceptoId = con.ConceptoId;
                c.Clave = con.Clave;
                c.Concepto = con.Concepto;
                c.Descripcion = con.Descripcion;
                c.Unidad = con.Unidad;
                c.Precio = con.Precio;
            }

            return PartialView("_Formulario", c);
        }

        [HttpPost]
        public JsonResult Create(int ConceptoId, string Clave, string Concepto, string Descripcion, string Unidad, float Precio)
        {
            try
            {
                Conceptos concepto = new Conceptos();
                concepto.ConceptoId = ConceptoId;
                concepto.Clave = Clave;
                concepto.Concepto = Concepto;
                concepto.Descripcion = Descripcion;
                concepto.Unidad = Unidad;
                concepto.Precio = Precio;
                concepto.Crear();
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
        public JsonResult Edicion(int ConceptoId, string Clave, string Concepto, string Descripcion, string Unidad, float Precio)
        {
            try
            {
                Conceptos concepto = new Conceptos();
                concepto.ConceptoId = ConceptoId;
                concepto.Clave = Clave;
                concepto.Concepto = Concepto;
                concepto.Descripcion = Descripcion;
                concepto.Unidad = Unidad;
                concepto.Precio = Precio;
                concepto.Editar();
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
                Conceptos concepto = new Conceptos();
                concepto.Eliminar(id);
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