##automatic OOA detection 2.0

####for first iteration of simulation (first s)========================================================
if (s == which(displ_data$timestamp == start_of_sim)) {

#loop through all w_v
for (w_v in windows_v) {
    
#select number of current w_v
ww <- which(w_v == windows_v)
    
#assign timestamps to all d_allcrit dataframes and create columns for criteria
d_allcrit[[w]][[ww]] <- data.frame(timestamp = d_alldispl$timestamp, w_v = w_v,
                                   crit1 = NA, crit2 = NA, crit3 = NA, crit4 = NA,
                                   crit_sum = NA)  

#loop through all rows
for (z in (w_smooth+1):s) {

#criterion 1: increasing displacement rate (same for all w_v)====================
if (isTRUE((d_alldispl[z,w+2] - d_alldispl[z-0.5*w_smooth,w+2]) > 
    (d_alldispl[z-0.5*w_smooth,w+2] - d_alldispl[z-(w_smooth),w+2]))) {
  d_allcrit[[w]][[ww]]$crit1[z] <- 1 } else {d_allcrit[[w]][[ww]]$crit1[z] <- 0}

#criterion 2: decreasing inverse velocity========================================
if (isTRUE((d_alliv[[w]][z,ww+2] < d_alliv[[w]][z-w_smooth,ww+2]))) {
  d_allcrit[[w]][[ww]]$crit2[z] <- 1 } else {d_allcrit[[w]][[ww]]$crit2[z] <- 0}

#criterion 3: decreasing median==================================================
if (isTRUE((d_allq50[[w]][z,ww+2] < d_allq50[[w]][z-w_smooth,ww+2]))) {
  d_allcrit[[w]][[ww]]$crit3[z] <- 1 } else {d_allcrit[[w]][[ww]]$crit3[z] <- 0}

#criterion 4: current iv lower than 99% of iv?===================================
if (isTRUE((d_alliv[[w]][z,ww+2] < d_allq1[[w]][z,ww+2]))) {
  d_allcrit[[w]][[ww]]$crit4[z] <- 1 } else {d_allcrit[[w]][[ww]]$crit4[z] <- 0}

#product of all criteria?========================================================
d_allcrit[[w]][[ww]]$crit_sum[z] <- 
  d_allcrit[[w]][[ww]]$crit1[z] *
  d_allcrit[[w]][[ww]]$crit2[z] *
  d_allcrit[[w]][[ww]]$crit3[z] *
  d_allcrit[[w]][[ww]]$crit4[z]

#close row loop
}

#close w_v loop
}

#is the OOA detected?=======================================================
  #loop through all rows as long as OOA is not detected
z <- w_smooth
  while (is.na(OOA) & z <= s) {
    z <- z +1
    
    #reset helping variable
    OOA_det <- 1
    
  #loop through all w_v
  for (ww in 1:length(windows_v)) {
  #check if crit_sum is 1 for all w_v
  OOA_det <- OOA_det * mean(d_allcrit[[w]][[ww]]$crit_sum[z:(z-w_smooth)], na.rm = T)
  }
    
  #if true, assign OOA at time since constant true criteria
    if (OOA_det == 1) {
      OOA <- d_allcrit[[w]][[ww]]$timestamp[z-w_smooth]
      
      #write into dataframe
      d_allooa[nrow(d_allooa)+1, 1] <- w_smooth
      d_allooa[nrow(d_allooa), 2] <- OOA - hours(2) #(!!timeshift between local and UTC)
      
      print(paste0("OOA detected at ", OOA))
      
      #update log-file in plots/main folder
      log_lines[length(log_lines)+1] <- ""
      log_lines[length(log_lines)+1] <- "OOA detected at"
      log_lines[length(log_lines)+1] <- paste(OOA)
      
      writeLines(log_lines, file.path(main, paste0(windows_smooth[1]/time_factor, "_log.txt"))) 
    }
    
#close while loop
}

#end first iteration condition. Otherwise add one line for new data=====================================
} else {

  #reset helping variable
  OOA_det <- 1
  
  #loop through all w_v
  for (w_v in windows_v) {
    
    #select number of current w_v
    ww <- which(w_v == windows_v)
    
    #add row to table
    d_allcrit[[w]][[ww]][[s,1]] <- latest
    d_allcrit[[w]][[ww]][[s,2]] <- w_v

      #criterion 1: increasing displacement rate (same for all w_v)====================
      if (isTRUE((d_alldispl[s,w+2] - d_alldispl[s-0.5*w_smooth,w+2]) > 
                 (d_alldispl[s-0.5*w_smooth,w+2] - d_alldispl[s-(w_smooth),w+2]))) {
        d_allcrit[[w]][[ww]]$crit1[s] <- 1 } else {d_allcrit[[w]][[ww]]$crit1[s] <- 0}
      
      #criterion 2: decreasing inverse velocity========================================
      if (isTRUE((d_alliv[[w]][s,ww+2] < d_alliv[[w]][s-w_smooth,ww+2]))) {
        d_allcrit[[w]][[ww]]$crit2[s] <- 1 } else {d_allcrit[[w]][[ww]]$crit2[s] <- 0}
      
      #criterion 3: decreasing median==================================================
      if (isTRUE((d_allq50[[w]][s,ww+2] < d_allq50[[w]][s-w_smooth,ww+2]))) {
        d_allcrit[[w]][[ww]]$crit3[s] <- 1 } else {d_allcrit[[w]][[ww]]$crit3[s] <- 0}
      
      #criterion 4: current iv lower than 99% of iv?===================================
      if (isTRUE((d_alliv[[w]][s,ww+2] < d_allq1[[w]][s,ww+2]))) {
        d_allcrit[[w]][[ww]]$crit4[s] <- 1 } else {d_allcrit[[w]][[ww]]$crit4[s] <- 0}
      
      #mean of all criteria over w_smooth per w_v====================================================
      d_allcrit[[w]][[ww]]$crit_sum[s] <- mean(
        c(d_allcrit[[w]][[ww]]$crit1[s:(s-w_smooth)],
        d_allcrit[[w]][[ww]]$crit2[s:(s-w_smooth)],
        d_allcrit[[w]][[ww]]$crit3[s:(s-w_smooth)],
        d_allcrit[[w]][[ww]]$crit4[s:(s-w_smooth)]),
        na.rm = T)

      #is the OOA detected?=(if all means are = 1) ====================================
      OOA_det <- OOA_det * d_allcrit[[w]][[ww]]$crit_sum[s]

    #close w_v loop
  }
  
#print info
if (is.na(OOA)) {
print(paste0("OOA_det = ", signif(OOA_det, digits = 2)))

#if true, assign OOA at time since constant true criteria
if (OOA_det == 1) {
OOA <- d_allcrit[[w]][[ww]]$timestamp[s-w_smooth]
      
#write into dataframe
d_allooa[nrow(d_allooa)+1, 1] <- w_smooth
d_allooa[nrow(d_allooa), 2] <- OOA - hours(2) #(!!timeshift between local and UTC)
      
print(paste0("OOA detected at ", OOA))

#update log-file in plots/main folder
log_lines[length(log_lines)+1] <- ""
log_lines[length(log_lines)+1] <- "OOA detected at"
log_lines[length(log_lines)+1] <- paste(OOA)

writeLines(log_lines, file.path(main, paste0(windows_smooth[1]/time_factor, "_log.txt"))) 

#close if is.na(OOA) and if OOA_det == 1
}
}
  
#end else condition
}
