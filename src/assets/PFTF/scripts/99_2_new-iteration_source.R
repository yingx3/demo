##99_new-iteration

#load newest data
load("displ_data.Rda")
s <- nrow(displ_data)

#read data and remove bad data
source("2_data-input.R")

#set parameters for plots
source("plot_params.R")

#loop through all windows_smooth
for (w_smooth in windows_smooth) { 
  
  #smooth data
  source("3_smooth-data.R")
  
  #plot displacement
  source("plot1_displ.R")
  
  #calculate velocity + inverse velocity
  source("4_calculate_v-iv.R")
  
  #plot inverse velocity
  source("plot2_iv.R")
  
  #calculate quantiles for OOA detection
  source("5_qntl.R")
  
  #detect OOA
  source("6_OOA-detection_auto_2.R")
  
  #plot quantiles for OOA detection
  source("plot3_OOA.R")
  source("plot4_OOAsuppl.R")   
  
  #calculate life expectancy
  source("7_calculate_tof.R")
  
  #plot life expectancy
  source("plot5_life-expec.R")
  
  #plot boxplot
  source("plot6_boxplot_tof.R")
  
  #plot combination
  source("plot7_combi.R")
  
  #save results in results.csv
  source("8_results.R")
  
#close w_smooth loop    
}
print(paste0("All calculations done for latest timestamp ", latest, ". Waiting for next iteration."))
