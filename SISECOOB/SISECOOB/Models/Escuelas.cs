using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mEscuelas))]
    public partial class Escuelas
    {
        public class mEscuelas
        {
            [Display(Name = "Identificador")]
            public int EscuelaID { get; set; }

            [Display(Name = "Clave")]
            public string Clave { get; set; }

            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

            [Display(Name = "Nivel")]
            public int Nivel_fk { get; set; }

            [Display(Name = "Domicilio")]
            public string Domicilio { get; set; }

            [Display(Name = "Municipios")]
            public int Municipio_fk { get; set; }

            [Display(Name = "Alumnos")]
            public int Alumnos { get; set; }

            [Display(Name = "Localidades")]
            public int Localidad_fk { get; set; }

            [Display(Name = "Turno")]
            public int Turno { get; set; }

            [Display(Name = "Director")]
            public string Director { get; set; }

            [Display(Name = "Zona")]
            public int Zona { get; set; }

            [Display(Name = "Sector")]
            public int Sector { get; set; }

            [Display(Name = "Tipo Predio")]
            public int TipoPredio { get; set; }


        }
        public string[] telefonos { get; set; }
        public string[] tipotelefono { get; set; }
        public int Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();

                //Escuelas es = new Escuelas();
                //es.Nombre = Nombre;
                //es.Clave = Clave;
                //es.Nivel_fk = Nivel_fk;
                //es.Municipio_fk = muni;
                //es.Localidad_fk = Localidad_fk;
                //es.Domicilio = Domicilio;
                //es.Alumnos = Alumnos;
                //es.Turno = Turno;
                //es.Director = Director;
                //es.Zona = Zona;
                //es.Sector = Sector;
                //es.TipoPredio = TipoPredio;

                db.Escuelas.AddObject(this);
                db.SaveChanges();

                return EscuelaID;

            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public int Editar()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Escuelas escuela = db.Escuelas.FirstOrDefault(i => i.EscuelaID == this.EscuelaID);
                escuela.Nombre = Nombre;
                escuela.Clave = Clave;
                escuela.Nivel_fk = Nivel_fk;
                escuela.Domicilio = Domicilio;
                escuela.Municipio_fk = Municipio_fk;
                escuela.Alumnos = Alumnos;
                escuela.Localidad_fk = Localidad_fk;
                escuela.Turno = Turno;
                escuela.Director = Director;
                escuela.Zona = Zona;
                escuela.Sector = Sector;
                escuela.TipoPredio = TipoPredio;


                db.SaveChanges();

                return EscuelaID;
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