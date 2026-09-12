##1_1_source-file
#run all calculations

#load required packages
source("1_2_packages.R")

#create dataframes for calculations
source("1_3_dataframes.R")

#create directories and save log-file
source("1_4_log.R")

#load data
rda_file <- if (file.exists("displ_data.rda")) "displ_data.rda" else "displ_data.Rda"
if (!file.exists(rda_file)) stop("displ_data.rda not found in working directory: ", getwd())
load(rda_file)
# displ_data <- tmp
# rm(tmp)

# 检查数据是否存在
# if (!exists("displ_data")) stop("数据未加载！请检查文件路径")
# 
# # 打印数据结构
# str(displ_data)
# 
# if (!"timestamp" %in% colnames(displ_data)) stop("缺少timestamp列！")
# 
# # 检查时间格式
# print(head(displ_data$timestamp))

#assign latest timestamp to start_of_sim if option is set to "latest"
# print(!is.POSIXct(start_of_sim))
if (!is.POSIXct(start_of_sim)) {
if (start_of_sim == "latest") {
start_of_sim <- displ_data[nrow(displ_data),1] }}

###sensitivity analysis###
#create dataframe for OOA sensitivity results
# OOA_diff_sens <- data.frame(timestamp = start_of_sim,
#                             w_smooth = 48)
### ###

#simulate real time data update
# print(which(displ_data$timestamp == start_of_sim))
for (s in which(displ_data$timestamp == start_of_sim):nrow(displ_data)) {

###sensitivity analysis###    
# #skip loop during OOA sensitivity analysis
# if (!is.na(loop_control)) {break}
### ###
  
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
  
  #make sure not all data within window_plot are NA
  # start_row <- max(1, s - (window_plot - 1))
  # print(window_plot)
  if (sum(is.na(d_alldispl[(s-(window_plot-1)):s,(w+2)])) > (window_plot-2)) {
    print("displ is only NA.")
    next} else {  
    
  #calculate velocity + inverse velocity
  source("4_calculate_v-iv.R")
  
  #plot inverse velocity
  source("plot2_iv.R")
  
  #calculate quantiles for OOA detection
  source("5_qntl.R")
#  source("5_qntl_sens.R") #for sensitivity analysis
  
  #detect OOA
  source("6_OOA-detection_auto_2.R")  #for automatic detection 2.0
#  source("6_OOA-detection_auto_sens.R") #for sensitivity analysis
  
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
#  source("plot7_combi_sens.R")  #for sensitivity analysis
  
#close only NA condition
}

  #save results in results.csv
  source("8_results.R")

#close w_smooth loop    
}
print(paste0("All calculations done for latest timestamp ", latest, ". Going on with next timestamp."))
  
#close simulating loop (s)
}
