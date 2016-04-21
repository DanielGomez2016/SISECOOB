using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mCapitulosdeObra))]
    public partial class CapitulosdeObra
    {
        public class mCapitulosdeObra
        {
            [Display(Name = "Identificador")]
            public int? CapituloObraID { get; set; }


            [Display(Name = "Clave")]
            public string Clave { get; set; }

            [Display(Name = "Capitulo de Obra")]
            public string Capitulo { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.CapitulosdeObra.AddObject(this);
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
                CapitulosdeObra cap = db.CapitulosdeObra.FirstOrDefault(i => i.CapituloObraID == CapituloObraID);
                cap.CapituloObraID = CapituloObraID;
                cap.Clave = Clave;
                cap.Capitulo = Capitulo;

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
                CapitulosdeObra cap = db.CapitulosdeObra.FirstOrDefault(i => i.CapituloObraID == id);
                db.CapitulosdeObra.DeleteObject(cap);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}