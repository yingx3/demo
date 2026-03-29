##create directories for results
#and create log.txt with all set parameters

#create subdirectories for results====
if (!file.exists(file.path(paste0(getwd(), "/plots/")))) {
  dir.create(file.path(paste0(getwd(), "/plots/")))}

if (!file.exists(file.path(paste0(getwd(), "/plots/suppl/")))) {
  dir.create(file.path(paste0(getwd(), "/plots/suppl/")))}

if (!file.exists(file.path(paste0(getwd(), "/plots/main/")))) {
  dir.create(file.path(paste0(getwd(), "/plots/main/")))}

main <- file.path(paste0(getwd(), "/plots/main/"))
# suppl <- file.path(paste0(getwd(), "/plots/suppl/", w_smooth))
# 
# if (!file.exists(suppl)) {
#   dir.create(suppl)} #option for no overwriting: else {
# #    stop("subdirectory named W_smooth already exists! No overwriting.") }

#create log character=======================================================
log_lines <- c("time of calculation", paste(Sys.time()), "",
               "working directory", getwd(), "",
               "start of calculations", paste(start_of_calc), "",
               "start of simulations", paste(start_of_sim), "",
               "time_factor", paste(time_factor), "",
               "plotting window", paste(window_plot/time_factor), "",
               "smoothing windows", paste(windows_smooth/time_factor), "",
               "velocity windows", paste(windows_v/time_factor), "",
               "unit_factor", paste(unit_factor), "",
               "unit_displ", paste(unit_displ), "",
               "unit_iv", paste(unit_iv), "",
               "unit_exp", paste(unit_exp), "",
               "OOA adjustment option", paste(OOA_adj), "",
               "supplementary plots option", paste(suppl_opt), "",
               "actual time of failure", paste(actual_tof), "",
               "preset OOA", paste(OOA), "",
               "bad timestamps", paste(bad_timestamps), "",
               "bad timestamp option", paste(bad_ts_opt), "",
               "comments", "enter comments here"
)

#save log as txt in plots/main folder
writeLines(log_lines, file.path(main, paste0(windows_smooth[1]/time_factor, "_log.txt"))) 
