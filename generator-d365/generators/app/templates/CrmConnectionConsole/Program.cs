using Microsoft.Crm.Sdk.Messages;
using Microsoft.Extensions.Configuration;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Text;

namespace <%= namespace %>
{
    class Program
    {
        private static IConfigurationRoot Configuration { get; set; }
        private static OrganizationService _orgService;
        static void Main(string[] args)
        {
            try
            {
                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json");
                Configuration = builder.Build();

                CrmConnection connection = CrmConnection.Parse(Configuration["ConnectionStrings:CrmConnectionString"]);

                using (_orgService = new OrganizationService(connection))
                {
                    //Do stuff
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                string message = ex.Message;
                throw;
            }
        }
    }
}