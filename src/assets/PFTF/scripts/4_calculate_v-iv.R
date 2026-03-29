##calculate v and iv

#loop through all W_v
for (w_v in windows_v) {
  
#select number of current w_v +2
ww <- which(w_v == windows_v) +2

####for first iteration of simulation (first s)========================================================
if (s == which(displ_data$timestamp == start_of_sim)) {
# print(which(displ_data$timestamp == start_of_sim))

#create list for velocity results
datalist = list()

#calculate velocity every row
for (i in w_v:s) {                                #new calculation every row from beginning to end
  lmdata <- d_alldispl[(i-(w_v-1)):i,c(1,w+2)]    #takes i. row and w_v rows before
  # print(i-(w_v-1))
  if (is.na(mean(lmdata[,2], na.rm = T))) {next} else {  #make sure not all data are NA
  lm_i <- lm(lmdata[,2] ~ lmdata[,1])   #linear regression model
  lm_slope <- data.frame(timestamp = lmdata[nrow(lmdata),1],   #timestamp
                         v = lm_i$coefficients[2])             #slope
  datalist[[i]] <- lm_slope                                    #assign to datalist
  }
}

#put all velocities into one dataframe
d_iv <- bind_rows(datalist)

#convert [v] = unit_displ / s to [v] = unit_displ / h
d_iv$v <- d_iv$v*60*60

#calculate inverse velocity
d_iv$iv <- 1/d_iv$v  # [iv] = h / unit_displ

#adjust unit with unit_factor
d_iv$iv <- d_iv$iv/unit_factor  # [iv] = h / unit_displ / unit_factor

#remove infinite values
d_iv$iv[d_iv$iv == Inf] <- NA

#add points to table
d_alliv[[w]][[paste0("iv_", w_v)]] <- d_iv$iv[match(d_alliv[[w]]$timestamp, d_iv$timestamp)]

#assign w_v in first row
d_alliv[[w]][[1,ww]] <- w_v

#end first iteration condition. Otherwise add one line for new data=====================================
} else {

#create list for velocity results
datalist = list()
  
#calculate velocity for last row
lmdata <- d_alldispl[(s-(w_v-1)):s,c(1,w+2)]    #takes last. row and w_v rows before
if (is.na(mean(lmdata[,2], na.rm = T))) {next} else {  #make sure not all data are NA
 lm_i <- lm(lmdata[,2] ~ lmdata[,1])   #linear regression model
 lm_slope <- data.frame(timestamp = lmdata[nrow(lmdata),1],   #timestamp
                        v = lm_i$coefficients[2])             #slope
    datalist[[i]] <- lm_slope                                 #assign to datalist
}
    
#put all velocities into one dataframe
d_iv <- bind_rows(datalist)

#convert [v] = unit_displ / s to [v] = unit_displ / h
d_iv$v <- d_iv$v*60*60

#calculate inverse velocity
d_iv$iv <- 1/d_iv$v  # [iv] = h / unit_displ

#adjust unit with unit_factor
d_iv$iv <- d_iv$iv/unit_factor  # [iv] = h / unit_displ / unit_factor

#remove infinite values
d_iv$iv[d_iv$iv == Inf] <- NA
    
#add points to table
d_alliv[[w]][[s,1]] <- latest
d_alliv[[w]][[s,2]] <- w_smooth
d_alliv[[w]][[s,ww]] <- d_iv$iv  
  
#end else condition===================================================================================
}

#create single W_v plots for supplementary plots if option is 'on'======================================
if (suppl_opt == "on") {
  
#plot v for suppl
plot(d_alliv[[w]]$timestamp, 1/d_alliv[[w]][[ww]], type = "l",
     main = paste0("velocity | w-v = ", w_v),
     ylab = "velocity", xlab = "",
     ylim = c(-1,ceiling(max(1/d_alliv[[w]][-1,ww], na.rm=T))))
abline (v = actual_tof, lty = 2)
dev.print(jpeg, file = paste0(suppl, "/2_v-", w_v, "-", nrow(d_alldispl), ".jpeg"),
          width = 2000, height = 1000)

#plot iv for suppl
plot(d_alliv[[w]]$timestamp, d_alliv[[w]][[ww]], type = "l",
     main = paste0("inverse velocity | w_v = ", w_v),
     ylab = "inverse velocity", xlab = "",
     ylim = c(-1,30*ceiling(d_alliv[[w]][[s,ww]])))
abline (v = actual_tof, lty = 2)
abline (h = 0, lty = 2)
dev.print(jpeg, file = paste0(suppl, "/3_iv-", w_v, "-", nrow(d_alldispl), ".jpeg"),
          width = 2000, height = 1000)
}

#end loop w_v
}
