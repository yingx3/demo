##calculate time of failure (tof)/ time to failure (ttf) after OOA is detected

#add row to dataframes
d_allttf[[w]][[s,1]] <- latest
d_alltof[[w]][[s,1]] <- latest
d_allttf[[w]][[s,2]] <- w_smooth
d_alltof[[w]][[s,2]] <- w_smooth

#if OOA is detected
if (!is.na(OOA)) {

#loop through all W_v
for (w_v in windows_v) {

#select number of current w_v +2
ww <- which(w_v == windows_v) +2

#take only values after OOA and right iv-column
d_ttf <- d_alliv[[w]][which(d_alliv[[w]]$timestamp >= OOA),c(1,ww)]

#convert Posixct into relative time since start_of_calculation (for forecast calculation purposes)
d_ttf$timestamp <- as.numeric(difftime(d_ttf$timestamp, start_of_calc, units = "hours"))

#create list for tof results
datalist3 = list()  

#calculate life expectancy for every row after OOA
for (j in 2:nrow(d_ttf)) {              #calculate new forecast for every row after OOA
  lmdata2 <- d_ttf[1:j,]                #takes every j. row and all rows since OOA
  colnames(lmdata2)[2] <- "iv"          #same name for every w_v
  if (is.na(mean(lmdata2$iv, na.rm = T))) {next} else {  #make sure not all data are NA
  lm_j <- lm(lmdata2$iv ~ lmdata2$timestamp)   #linear regression model
  lm_ttf <- data.frame(timestamp = lmdata2[nrow(lmdata2),1],    #time prediction is made
                       lm_ttf_intercept = lm_j$coefficients[1], #intercept of iv-lm
                       lm_ttf_slope = lm_j$coefficients[2])     #slope of iv-lm
  datalist3[[j]] <- lm_ttf
  }
}

#put all regressions into one dataframe
d_ttf <- bind_rows(datalist3)

#erase all slopes with positive values
d_ttf$lm_ttf_slope[d_ttf$lm_ttf_slope >= 0] <- NA

#calculate time of forecasted failure (relative to start_of_calc)
d_ttf$tof <- d_ttf$lm_ttf_intercept/(-d_ttf$lm_ttf_slope)   

#calculate time to forecasted failure (relative to start_of_calc)
d_ttf$ttf <- d_ttf$tof - d_ttf$timestamp

#convert timestamp and time of failure back to Posixct
d_ttf$timestamp <- start_of_calc + d_ttf$timestamp*60*60
d_ttf$tof <- start_of_calc + d_ttf$tof*60*60

#adjust ttf according to chosen unit (calculation is in hours)
if (unit_exp == "s") {d_ttf$ttf <- d_ttf$ttf*60*60}
if (unit_exp == "min") {d_ttf$ttf <- d_ttf$ttf*60}
if (unit_exp == "h") {}
if (unit_exp == "d") {d_ttf$ttf <- d_ttf$ttf/24}

#add points to table
d_allttf[[w]][[paste0("ttf_", w_v)]] <- d_ttf$ttf[match(d_allttf[[w]]$timestamp, d_ttf$timestamp)]
d_alltof[[w]][[paste0("tof_", w_v)]] <- d_ttf$tof[match(d_alltof[[w]]$timestamp, d_ttf$timestamp)]

#assign w_v in first row
d_allttf[[w]][[1, ww]] <- w_v
d_alltof[[w]][[1, ww]] <- w_v #given in seconds since 1970-01-01 here! (Posixct)

#create single life expectancy plots for supplementary plots if option is 'on'================================
if (suppl_opt == "on") {
  
#plot life expectancy for suppl
plot(d_allttf[[w]]$timestamp, d_allttf[[w]][[ww]], pch = 20,
     ylim = c(0, window_plot),
     xlim = xlimits,
     main = paste0("life expectancy ", "w_smooth = ", w_smooth,  ", w_v = ", w_v),
     xlab = "time when forecast is made", ylab = "life expectancy",
     xaxs = "i")
abline(h = 0, col = "blue")
dev.print(jpeg, file = paste0(suppl, "/5_ttf-", w_v, "-", nrow(d_alldispl), ".jpeg"),
          width = 1000, height = 1000)
}

#end loop w_v
}
  
#end if OOA is NA
}
