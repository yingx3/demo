##create results.csv with all results

#only if actual_tof is assigned and OOA is detected and all iterations are done
if (!is.na(actual_tof) & !is.na(OOA) & latest == end_of_calc) {

#forecast at actual tof
xx <- which(d_allttf[[w]]$timestamp == actual_tof)

if (length(xx) != 0) {
d_results_0 <- data.frame(
  fw_min_0d = d_allttf[[w]]$w_f1[xx], #lower failure window value
  fc_min_0d = min(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #lowest forecast value
  mean_0d = d_allttf[[w]]$mean[xx], #mean value
  fc_max_0d = max(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #highest forecast value
  fw_max_0d = d_allttf[[w]]$w_f2[xx]) #highest failure window value
} else {d_results_0 <- data.frame(fc_0 = NA)}

#forecast 1 day before actual tof
xx <- which(d_allttf[[w]]$timestamp == actual_tof - hours(24))

if (length(xx) != 0) {
d_results_1 <- data.frame(
  fw_min_1d = d_allttf[[w]]$w_f1[xx], #lower failure window value
  fc_min_1d = min(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #lowest forecast value
  mean_1d = d_allttf[[w]]$mean[xx], #mean value
  fc_max_1d = max(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #highest forecast value
  fw_max_1d = d_allttf[[w]]$w_f2[xx]) #highest failure window value
} else {d_results_1 <- data.frame(fc_1 = NA)}

#forecast 2 days before actual tof
xx <- which(d_allttf[[w]]$timestamp == actual_tof - hours(2*24))

if (length(xx) != 0) {
d_results_2 <- data.frame(
  fw_min_2d = d_allttf[[w]]$w_f1[xx], #lower failure window value
  fc_min_2d = min(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #lowest forecast value
  mean_2d = d_allttf[[w]]$mean[xx], #mean value
  fc_max_2d = max(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #highest forecast value
  fw_max_2d = d_allttf[[w]]$w_f2[xx]) #highest failure window value
} else {d_results_2 <- data.frame(fc_2 = NA)}

#forecast 3 days before actual tof
xx <- which(d_allttf[[w]]$timestamp == actual_tof - hours(3*24))

if (length(xx) != 0) {
d_results_3 <- data.frame(
  fw_min_3d = d_allttf[[w]]$w_f1[xx], #lower failure window value
  fc_min_3d = min(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #lowest forecast value
  mean_3d = d_allttf[[w]]$mean[xx], #mean value
  fc_max_3d = max(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #highest forecast value
  fw_max_3d = d_allttf[[w]]$w_f2[xx]) #highest failure window value
} else {d_results_3 <- data.frame(fc_3 = NA)}

#forecast 4 days before actual tof
xx <- which(d_allttf[[w]]$timestamp == actual_tof - hours(4*24))

if (length(xx) != 0) {
  d_results_4 <- data.frame(
    fw_min_4d = d_allttf[[w]]$w_f1[xx], #lower failure window value
    fc_min_4d = min(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #lowest forecast value
    mean_4d = d_allttf[[w]]$mean[xx], #mean value
    fc_max_4d = max(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #highest forecast value
    fw_max_4d = d_allttf[[w]]$w_f2[xx]) #highest failure window value
} else {d_results_4 <- data.frame(fc_4 = NA)}

#forecast 5 days before actual tof
xx <- which(d_allttf[[w]]$timestamp == actual_tof - hours(5*24))

if (length(xx) != 0) {
d_results_5 <- data.frame(
  fw_min_5d = d_allttf[[w]]$w_f1[xx], #lower failure window value
  fc_min_5d = min(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #lowest forecast value
  mean_5d = d_allttf[[w]]$mean[xx], #mean value
  fc_max_5d = max(d_allttf[[w]][xx,3:(2+length(windows_v))], na.rm = TRUE), #highest forecast value
  fw_max_5d = d_allttf[[w]]$w_f2[xx]) #highest failure window value
} else {d_results_5 <- data.frame(fc_5 = NA)}

#relevant data for results
d_results <- data.frame(
  analysis_with_data_from = displ_data[1,1],
  actual_tof = actual_tof,
  w_smooth = w_smooth/time_factor,
  w_v = paste(windows_v/time_factor, collapse = ","),
  detected_OOA = OOA,
  OOA_before_failure_d = as.numeric(difftime(actual_tof, OOA, units = "day")),
  ttf_unit = unit_exp
  )

#bind all results together
d_results <- cbind(d_results, d_results_0, d_results_1, d_results_2, d_results_3, d_results_4, d_results_5)

#save results as csv in plots/main folder
write.csv2(d_results, file.path(main, paste0(w_smooth/time_factor, "_results.csv")))

#close if conditions
}
