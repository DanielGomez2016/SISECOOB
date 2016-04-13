using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mTipoEstructura))]
    public partial class TipoEstructura
    {
        public class mTipoEstructura
        {
            [Display(Name = "Identificador")]
            public int? EstructruaID { get; set; }


            [Display(Name = "Tipo Estructura")]
            public string TipoEstructura1 { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.TipoEstructura.AddObject(this);
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
                TipoEstructura te = db.TipoEstructura.FirstOrDefault(i => i.EstructuraID == EstructuraID);
                te.TipoEstructura1 = TipoEstructura1;

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
                TipoEstructura te = db.TipoEstructura.FirstOrDefault(i => i.EstructuraID == id);
                db.TipoEstructura.DeleteObject(te);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}