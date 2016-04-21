using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace SISECOOB.Models
{
    [MetadataType(typeof(mProgramas))]
    public partial class Programas
    {
        public class mProgramas
        {
            [Display(Name = "Identificador")]
            public int? ProgramaID { get; set; }


            [Display(Name = "Programa")]
            public string Programa { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Programas.AddObject(this);
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
                Programas pro = db.Programas.FirstOrDefault(i => i.ProgramaID == this.ProgramaID);
                pro.Programa = Programa;

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
                Programas pro = db.Programas.FirstOrDefault(i => i.ProgramaID == id);
                db.Programas.DeleteObject(pro);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}