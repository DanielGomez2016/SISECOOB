using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mNivelesEducativos))]
    public partial class NivelesEducativos
    {
        public class mNivelesEducativos
        {
            [Display(Name = "Identificador")]
            public int? NivelID { get; set; }


            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.NivelesEducativos.AddObject(this);
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
                NivelesEducativos niveles = db.NivelesEducativos.FirstOrDefault(i => i.NivelID == this.NivelID);
                niveles.Nombre = Nombre;

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
                NivelesEducativos niveles = db.NivelesEducativos.FirstOrDefault(i => i.NivelID == id);
                db.NivelesEducativos.DeleteObject(niveles);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}