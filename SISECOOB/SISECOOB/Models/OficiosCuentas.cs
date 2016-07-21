using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    public partial class OficiosCuentas
    {

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();

                db.OficiosCuentas.AddObject(this);
                db.SaveChanges();

            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}