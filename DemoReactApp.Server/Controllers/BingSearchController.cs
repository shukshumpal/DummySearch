using DemoReactApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace DemoReactApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class BingSearchController : ControllerBase
    {
        const string strURL = "https://api.bing.microsoft.com/v7.0/search";

        private readonly IConfiguration _configuration;
        private readonly ILogger<BingSearchController> _logger;

        private const string COUNT_PARAMETER = "&count=";
        private const string OFFSET_PARAMETER = "&offset=";
        private string strKey { get { return _configuration["BingSearchKey"]; } }
        private string pageResponseCount { get { return _configuration["resultCountPerPage"]; } }

        public BingSearchController(ILogger<BingSearchController> logger, IConfiguration configuration)
        {
            _configuration= configuration;  
            _logger = logger;
        }

        [HttpGet]
        [Route("searchResults")]
        public SearchResult GetSearchResult([FromQuery]string strSearch, [FromQuery] int pageNum)
        {

            SearchResult strRes;
            if (!string.IsNullOrEmpty(strKey))
            {
                try
                {
                    strRes = SearchBing(strSearch, pageNum);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Some exception occured while trying to search for {strSearch}", ex); 
                }

            }
            else
            {
                throw new Exception($"Invalid Bing Search API key");
            }

            return strRes;
        }
        static async Task<HttpResponseMessage> MakeRequestAsync(string queryString, string apiKey)
        {
            var client = new HttpClient();

            // Request headers. The subscription key is the only required header but you should
            // include User-Agent (especially for mobile), X-MSEdge-ClientID, X-Search-Location
            // and X-MSEdge-ClientIP (especially for local aware queries).

            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);

            return (await client.GetAsync(strURL + queryString));
        }
        private SearchResult SearchBing(string strQuery, int pageNum)
        {
            var uriQuery = strURL + "?q=" + Uri.EscapeDataString(strQuery);
            int offsetVal = pageNum * Convert.ToInt32(pageResponseCount);
            uriQuery += COUNT_PARAMETER + pageResponseCount;
            uriQuery += OFFSET_PARAMETER + offsetVal.ToString();
            
            WebRequest wbReq = HttpWebRequest.Create(uriQuery);

            wbReq.Headers["Ocp-Apim-Subscription-Key"] = strKey;

            HttpWebResponse hResp =
               (HttpWebResponse)wbReq.GetResponseAsync().Result;

            string strJSON = new
               StreamReader(hResp.GetResponseStream()).ReadToEnd();

            var varRes = new SearchResult()
            {
                strJSON = strJSON,
                dcHeaders = new Dictionary<String, String>()
            };

            foreach (String strHead in hResp.Headers)
            {

                if (strHead.StartsWith("BingAPIs-") ||
                   strHead.StartsWith("X-MSEdge-"))
                {

                    varRes.dcHeaders[strHead] = hResp.Headers[strHead];

                }
            }

            return varRes;
        }
    }
}
