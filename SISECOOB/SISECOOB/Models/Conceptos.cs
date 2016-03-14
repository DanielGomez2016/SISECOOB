using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mConceptos))]
    public partial class Conceptos
    {
        public class mConceptos
        {
            [Display(Name = "Identificador")]
            public int? ConceptoId { get; set; }

            [Display(Name = "Clave")]
            public string Clave { get; set; }

            [Display(Name = "Concepto")]
            public int Concepto { get; set; }

            [Display(Name = "Descripcion")]
            public string Descripcion { get; set; }

            [Display(Name = "Unidad")]
            public string Unidad { get; set; }

            [Display(Name = "Precio")]
            public double Precio { get; set; }

        }
        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Conceptos.AddObject(this);
                db.SaveChanges();

            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Editar()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Conceptos concepto = db.Conceptos.FirstOrDefault(i => i.ConceptoId == this.ConceptoId);
                concepto.Clave = Clave;
                concepto.Concepto = Concepto;
                concepto.Descripcion = Descripcion;
                concepto.Unidad = Unidad;
                concepto.Precio = Precio;

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Eliminar(int id)
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Conceptos con = db.Conceptos.FirstOrDefault(i => i.ConceptoId == id);

                if (con != null)
                {

                    db.Conceptos.DeleteObject(con);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}