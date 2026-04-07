## PFTF - Prospective failure forecasting using inverse velocity
##
## This allows prospective prediction analysis of displacement data
##
## author: Johannes Leinauer
## date:   2020-2022
##
## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ##

##input data==========
#set working directory
setwd("E:/Projects/ZHLXT/算法/基于位移监测滑坡预警/PFTF_1.0.0/PFTF_1.0.0/PFTF-PFTF_1.0.0") #<-- set your pathname here

#set start of calculations
#as.POSIXct("YYYY-MM-DD HH:MM", tz="UTC")
start_of_calc <- as.POSIXct("2022-01-01 00:00", tz="UTC")

#set start of simulation timestamp if you want to simulate real time before latest timestamp of displ_data
#if not, set "latest" (importing all data)
#as.POSIXct("YYYY-MM-DD HH:MM", tz="UTC")
start_of_sim <- as.POSIXct("2022-02-26 23:00:00", tz="UTC")
# "latest"

#set time factor for data frequency
#factor to convert input frequency to unit_exp
#e.g. data = 15 min, unit_exp = h --> time_factor = 4
#e.g. data = 1 h, unit_exp = h --> time_factor = 1
time_factor <- 1

#set plotting window (time span for plots in unit of unit_exp)
#if the unit_exp is h, 120 means 120 h
window_plot <- 180*time_factor

#set smoothing windows (in unit of unit_exp))
windows_smooth <- c(48)*time_factor
# w_smooth_loop*time_factor #when using a wrapper script 1_0_analysis-loop.R

#set windows for velocity calculation (in unit of unit_exp)) [supply at least 2]
windows_v <- c(6,12,24,48,72)*time_factor
# w_v_loop*time_factor #when using a wrapper script 1_0_analysis-loop.R

#set unit factor for inverse velocity (calculation without unit factor is in h per displacement unit [e.g. h/m])
unit_factor <- 1

#set units of plotted parameters
unit_displ <- "mm"
unit_iv <- "h/m" # [iv] = h / unit_displ / unit_factor
unit_exp <- "h"   # supported: "s", "min", "h", "d"

#set file format (jpeg or pdf) in which final combi-plots are saved
file_format <- "jpg"

#set option of OOA adjustment to 'on' or 'off'
OOA_adj <- "off"

#should supplementary plots be saved? set to 'on' or 'off'
suppl_opt <- "off"

#put actual time of failure if known (post-event); if unknown put NA (pre-event)
#as.POSIXct("YYYY-MM-DD HH:MM", tz="UTC")
# actual_tof <- as.POSIXct("2022-03-01 00:00", tz="UTC")
actual_tof <- NA

#set OOA if already known, otherwise set NA (will be assigned later)
#as.POSIXct("YYYY-MM-DD HH:MM", tz="UTC")
OOA <- NA

#set detected bad timestamps with bad data here; if there are none set NA
bad_timestamps <- NA

#set option to enter additional bad timestamps to 'on' or 'off'
bad_ts_opt <- "off"

##run files for forecast calculation==========
source("1_1_source-file.R")
