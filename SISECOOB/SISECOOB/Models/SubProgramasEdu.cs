using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace SISECOOB.Models
{
    [MetadataType(typeof(mSubProgramasEdu))]
    public partial class SubProgramasEdu
    {
        public class mSubProgramasEdu
        {
            [Display(Name = "Identificador")]
            public int? SubprogramaID { get; set; }


            [Display(Name = "SubPrograma")]
            public string Subprograma { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.SubProgramasEdu.AddObject(this);
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
                SubProgramasEdu pro = db.SubProgramasEdu.FirstOrDefault(i => i.SubprogramaID == this.SubprogramaID);
                pro.Subprograma = Subprograma;

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
                SubProgramasEdu pro = db.SubProgramasEdu.FirstOrDefault(i => i.SubprogramaID == id);
                db.SubProgramasEdu.DeleteObject(pro);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}