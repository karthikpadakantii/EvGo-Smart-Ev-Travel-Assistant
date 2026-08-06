package com.evgo.integrationservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(
        name = "OPENCHARGE-MAP",
        url = "https://api.openchargemap.io"
)
public interface OpenChargeMapClient {


    @GetMapping("/v3/poi/")
    String getChargingStations(

            @RequestParam("latitude")
            Double latitude,

            @RequestParam("longitude")
            Double longitude,

            @RequestParam("distance")
            Integer distance,

            @RequestParam("maxresults")
            Integer maxResults,

            @RequestParam("key")
            String apiKey

    );

}