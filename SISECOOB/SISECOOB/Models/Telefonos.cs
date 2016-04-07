using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    public partial class Telefonos
    {

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();

                db.Telefonos.AddObject(this);
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
                Escuelas esc = db.Escuelas.FirstOrDefault(i => i.EscuelaID == id);

                if (esc != null)
                {

                    db.Escuelas.DeleteObject(esc);
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