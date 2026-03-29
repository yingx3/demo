##read data and remove bad data

#read data (supply "displ_data.Rda"-file with displacement data)
#form of the data frame: column1: timestamp [POSIXct], column2: displ [num]
#every row should represent equal timesteps, all timesteps should be supplied

#load data
load("displ_data.Rda")

#save maximum timestamp
end_of_calc <- displ_data[nrow(displ_data),1]

#simulate real time data update
displ_data <- displ_data[1:s,]

#remove bad data
for (h in 1:length(bad_timestamps)) {
  displ_data[which(displ_data$timestamp == bad_timestamps[[h]]),2] <- NA
}

####for first iteration of simulation (first s)========================================================
if (s == which(displ_data$timestamp == start_of_sim)) {

  #assign data to dataframe
  d_alldispl <- data.frame(timestamp = displ_data$timestamp, displ_raw = displ_data$displ)

#end first iteration condition. Otherwise add one line for new data=====================================
  
} else if  (bad_ts_opt == "on") { #option to add additional bad timestamps
    bad_ts_add <- NA
    print("If you want to add addtional bad timestamps, calculations will be aborted. You can add additional bad timestamps in 1_1_input.R and then restart calculations from a appropiate timestamp.")
    bad_ts_add <- readline(paste("Do you want to add additional timestamps? Enter 'y' or 'n': "))
    if (bad_ts_add == "y") {print("Calculations will be aborted. Add additional bad timestamps in the 1_1_input.R and restart calculations from a appropiate timestamp.")
    calculations_aborted #produces an error to abort calculations
    }
  
  #add new line
  d_alldispl[s,] <- c(displ_data[s,],rep(NA, length(windows_smooth)))
  
#end else if condition===================================================================================
} else {
  
  #add new line
  d_alldispl[s,] <- c(displ_data[s,],rep(NA, length(windows_smooth)))
}

#assign latest timestamp
latest <- max(displ_data$timestamp)
# print(displ_data$timestamp)
