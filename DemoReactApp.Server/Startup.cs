using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoReactApp.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader());
            });
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //app.UseMiddleware<GlobalRoutePrefixMiddleware>("/api");

            //app.UsePathBase(new PathString("/api"));
            
            app.UseRouting();

            app.UseCors("AllowAll");  

            app.UseAuthorization();

            //app.mapControllerRoutes()
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public class GlobalRoutePrefixMiddleware
        {
            private readonly RequestDelegate _next;
            private readonly string _routePrefix;

            public GlobalRoutePrefixMiddleware(RequestDelegate next, string routePrefix)
            {
                _next = next;
                _routePrefix = routePrefix;
            }

            public async Task InvokeAsync(HttpContext context)
            {
                context.Request.PathBase = new PathString(_routePrefix);
                await _next(context);
            }
        }
    }
}
