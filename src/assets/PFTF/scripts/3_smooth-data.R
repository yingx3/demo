##smooth data and plot displacement

#create subdirectory for every w_smooth in supplementary plots if it doesn´t exist yet====
suppl <- file.path(paste0(getwd(), "/plots/suppl/", w_smooth/time_factor))

if (!file.exists(suppl)) {
  dir.create(suppl)} #option for no overwriting: else {
#    stop("subdirectory named W_smooth already exists! No overwriting.") }

#select number of current w_smooth
w <- which(w_smooth == windows_smooth)

####for first iteration of simulation (first s)========================================================
if (s == which(displ_data$timestamp == start_of_sim)) {
  
  #smooth data with smoothing windows
  d_alldispl[[paste0("displ_", w_smooth)]] <- rollmean(d_alldispl$displ_raw, w_smooth, fill = NA, align = "right", na.rm = TRUE)
  d_alldispl[is.na(d_alldispl[[w+2]]),w+2] <- NA
  
  #assign timestamps to all d_all dataframes
  d_alliv[[w]] <- data.frame(timestamp = d_alldispl$timestamp, w_smooth = w_smooth)
  d_alliv[[w]][1,1] <- NA #row for assigning W_v
  d_allq1[[w]] <- data.frame(timestamp = d_alldispl$timestamp, w_smooth = w_smooth)
  d_allq1[[w]][1,1] <- NA #row for assigning W_v
  d_allq50[[w]] <- data.frame(timestamp = d_alldispl$timestamp, w_smooth = w_smooth)
  d_allq50[[w]][1,1] <- NA #row for assigning W_v
  d_allttf[[w]] <- data.frame(timestamp = d_alldispl$timestamp, w_smooth = w_smooth)
  d_allttf[[w]][1,1] <- NA #row for assigning W_v
  d_alltof[[w]] <- data.frame(timestamp = d_alldispl$timestamp, w_smooth = w_smooth)
  d_alltof[[w]][1,1] <- NA #row for assigning W_v

#end first iteration condition. Otherwise add one line for new data=====================================
} else {
  
  #smooth data with smoothing windows
  d_alldispl[[s,w+2]] <- mean(d_alldispl[((s-(w_smooth-1)):s),2], fill = NA, na.rm = TRUE)
  
#end else condition===================================================================================
}

#create displacement plot for supplementary plots if option is 'on'=======================================
#plot displ for suppl
if (suppl_opt == "on") {
plot(d_alldispl[,1], d_alldispl[,w+2], type = "l",
     main = paste0("displacment | w_smooth = ", w_smooth),
     ylab = "displacement", xlab = "",
     ylim = c(floor(min(d_alldispl[,w+2], na.rm=T)),ceiling(max(d_alldispl[,w+2], na.rm=T))))
dev.print(jpeg, file = paste0(suppl, "/1z_displ-", nrow(d_alldispl), ".jpeg"),
          width = 2000, height = 1000)
}
