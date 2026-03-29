##calculate quantiles

#loop through all W_v
for (w_v in windows_v) {

#select number of current w_v +2
ww <- which(w_v == windows_v) +2

####for first iteration of simulation (first s)========================================================
if (s == which(displ_data$timestamp == start_of_sim)) {
  
#create list for quantile results
datalist2 = list()

#calculate quantiles every row
for (q in (5:s)) {               #new calculation every row from beginning to end
  qntldata <- d_alliv[[w]][2:q,c(1,ww)]    #takes q. row and all rows before
  colnames(qntldata)[2] <- "iv"            #overwrite column name to iv
  qntldata$iv[qntldata$iv < 0] <- NA       #erase all negative inverse velocities
  if (is.na(mean(qntldata$iv, na.rm = T))) {next} else {  #make sure not all data are NA
  dqntl <- data.frame(timestamp = qntldata[nrow(qntldata),1],   #timestamp
                      qntl_1 = quantile(qntldata$iv, 0.01, na.rm = TRUE),  #1% quantile
                      qntl_50 = quantile(qntldata$iv, 0.50, na.rm = TRUE)) #50% quantile
  datalist2[[q]] <- dqntl
  }
}

#put all quantiles into one dataframe
d_q <- bind_rows(datalist2)

#add points to table
d_allq1[[w]][[paste0("q_01_", w_v)]] <- d_q$qntl_1[match(d_allq1[[w]]$timestamp, d_q$timestamp)]
d_allq50[[w]][[paste0("q_50_", w_v)]] <- d_q$qntl_50[match(d_allq50[[w]]$timestamp, d_q$timestamp)]

#assign w_v in first row
d_allq1[[w]][[1,ww]] <- w_v
d_allq50[[w]][[1,ww]] <- w_v

#end first iteration condition. Otherwise add one line for new data=====================================
} else {
  
#create list for quantile results
datalist2 = list()
  
#calculate quantiles for last row
  qntldata <- d_alliv[[w]][1:s,c(1,ww)]    #takes q. row and all rows before
  colnames(qntldata)[2] <- "iv"            #overwrite column name to iv
  qntldata$iv[qntldata$iv < 0] <- NA       #erase all negative inverse velocities
  if (is.na(mean(qntldata$iv, na.rm = T))) {next} else {  #make sure not all data are NA
    dqntl <- data.frame(timestamp = qntldata[nrow(qntldata),1],   #timestamp
                        qntl_1 = quantile(qntldata$iv, 0.01, na.rm = TRUE),  #1% quantile
                        qntl_50 = quantile(qntldata$iv, 0.50, na.rm = TRUE)) #50% quantile
    datalist2[[q]] <- dqntl
  }
  
#put quantiles into one dataframe and calculate quantile difference
d_q <- bind_rows(datalist2)

#add points to table
d_allq1[[w]][[s,1]] <- latest
d_allq1[[w]][[s,2]] <- w_smooth
d_allq1[[w]][[s,ww]] <- d_q$qntl_1

d_allq50[[w]][[s,1]] <- latest
d_allq50[[w]][[s,2]] <- w_smooth
d_allq50[[w]][[s,ww]] <- d_q$qntl_50
  
#end else condition===================================================================================
}

#create single quantile plots for supplementary plots if option is 'on'================================
if (suppl_opt == "on") {
  
#plot dif_qntl for suppl
plot(d_allq1[[w]]$timestamp, d_allq1[[w]][[ww]], type = "p", pch = 20,
     main = paste0("quantiles of iv | w-v = ", w_v),
     ylab = "1% and 50% quantiles", xlab = "",
     ylim = c(min(d_allq1[[w]][-1,ww], na.rm=T), max(d_allq50[[w]][-1,ww], na.rm=T)))
points(d_allq50[[w]]$timestamp, d_allq50[[w]][[ww]], type = "p", pch = 20, col = 2)
abline (v = actual_tof, lty = 2)
dev.print(jpeg, file = paste0(suppl, "/4_difq-", w_v, "-", nrow(d_alldispl), ".jpeg"),
          width = 2000, height = 1000)
}

#end loop w_v
}
