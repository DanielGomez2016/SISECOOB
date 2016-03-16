using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mTipoOficios))]
    public partial class TipoOficios
    {
        public class mTipoOficios
        {
            [Display(Name = "Identificador")]
            public int? TipoOficioID { get; set; }


            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

        }
        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.TipoOficios.AddObject(this);
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
                TipoOficios oficio = db.TipoOficios.FirstOrDefault(i => i.TipoOficioID == this.TipoOficioID);
                oficio.Nombre = Nombre;

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
                TipoOficios to = db.TipoOficios.FirstOrDefault(i => i.TipoOficioID == id);

                if (to != null)
                {
                    db.TipoOficios.DeleteObject(to);
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