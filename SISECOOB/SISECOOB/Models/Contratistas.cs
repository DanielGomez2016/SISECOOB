using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mContratistas))]
    public partial class Contratistas
    {
        public class mContratistas
        {
            [Display(Name = "Identificador")]
            public int ContratistaID { get; set; }

            [Display(Name = "Domicilio")]
            public string Domicilio { get; set; }

            [Display(Name = "RFC")]
            public string RFC { get; set; }

            [Display(Name = "CMIC")]
            public string CMIC { get; set; }

            [Display(Name = "CURP")]
            public string CURP { get; set; }

            [Display(Name = "Email")]
            public string Email { get; set; }

            [Display(Name = "RPUC")]
            public string RPUC { get; set; }

            [Display(Name = "Vigencia")]
            public DateTime Vigencia { get; set; }

            [Display(Name = "Capital")]
            public double Capital { get; set; }

            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

            [Display(Name = "NumEstructura")]
            public string NumEstructura { get; set; }

            [Display(Name = "Cargo")]
            public DateTime Cargo { get; set; }

            [Display(Name = "FechaRepleg")]
            public double FechaRepleg { get; set; }

            [Display(Name = "NumNotario")]
            public string NumNotario { get; set; }

            [Display(Name = "NomNotario")]
            public string NomNotario { get; set; }

            [Display(Name = "Residencia")]
            public DateTime Residencia { get; set; }

            [Display(Name = "NumEscrituraActCons")]
            public double NumEscrituraActCons { get; set; }

            [Display(Name = "Volumen")]
            public string Volumen { get; set; }

            [Display(Name = "FechaActa")]
            public string FechaActa { get; set; }

            [Display(Name = "NumNotarioActCons")]
            public DateTime NumNotarioActCons { get; set; }

            [Display(Name = "NomNotarioActCons")]
            public double NomNotarioActCons { get; set; }

            [Display(Name = "ResidenciaActCons")]
            public string ResidenciaActCons { get; set; }

            [Display(Name = "NumActa")]
            public string NumActa { get; set; }

            [Display(Name = "FechaNacimiento")]
            public string FechaNacimiento { get; set; }

            [Display(Name = "LugarNac")]
            public string LugarNac { get; set; }

            [Display(Name = "LugarRegistro")]
            public string LugarRegistro { get; set; }

            [Display(Name = "personafisica")]
            public bool personafisica { get; set; }

        }
        public string[] telefonos { get; set; }
        public string[] tipotelefono { get; set; }

        public int Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();

                db.Contratistas.AddObject(this);
                db.SaveChanges();

                return ContratistaID;

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
                Contratistas contratista = db.Contratistas.FirstOrDefault(i => i.ContratistaID == this.ContratistaID);

                contratista.Domicilio = Domicilio;
                contratista.RFC = RFC;
                contratista.CMIC = CMIC;
                contratista.CURP = CURP;
                contratista.Email = Email;
                contratista.RPUC = RPUC;
                contratista.Vigencia = Vigencia;
                contratista.Capital = Capital;
                contratista.Nombre = Nombre;
                contratista.NumEstructura = NumEstructura;
                contratista.Cargo = Cargo;
                contratista.FechaRepleg = FechaRepleg;
                contratista.NumNotario = NumNotario;
                contratista.NomNotario = NomNotario;
                contratista.Residencia = Residencia;
                contratista.NumEscrituraActCons = NumEscrituraActCons;
                contratista.Volumen = Volumen;
                contratista.FechaActa = FechaActa;
                contratista.NumNotarioActCons = NumNotarioActCons;
                contratista.NomNotarioActCons = NomNotarioActCons;
                contratista.ResidenciaActCons = ResidenciaActCons;
                contratista.NumActa = NumActa;
                contratista.FechaNacimiento = FechaNacimiento;
                contratista.LugarNac = LugarNac;
                contratista.LugarRegistro = LugarRegistro;
                contratista.personafisica = personafisica;

                db.SaveChanges();

                return ContratistaID;
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
                Contratistas cont = db.Contratistas.FirstOrDefault(i => i.ContratistaID == id);

                if (cont != null)
                {

                    db.Contratistas.DeleteObject(cont);
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