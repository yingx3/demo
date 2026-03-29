##create dataframes for calculations

#dataframe for all displacements (displ)
d_alldispl <- data.frame(timestamp = rep(NA, window_plot), w_smooth = windows_smooth)

#dataframes for all inverse velocities (iv)
d_alliv <- lapply(windows_smooth, FUN = function(windows_smooth) data.frame(timestamp = rep(NA, window_plot),
                                                                            w_smooth = windows_smooth))
names(d_alliv) <- windows_smooth

#dataframe for all 1% quantiles (determination of OOA)
d_allq1 <- lapply(windows_smooth, FUN = function(windows_smooth) data.frame(timestamp = rep(NA, window_plot),
                                                                           w_smooth = windows_smooth))
names(d_allq1) <- windows_smooth

#dataframe for all 50% quantiles (determination of OOA)
d_allq50 <- lapply(windows_smooth, FUN = function(windows_smooth) data.frame(timestamp = rep(NA, window_plot),
                                                                            w_smooth = windows_smooth))
names(d_allq50) <- windows_smooth

#dataframe for all criteria of OOA detection (lists inside list)
d_allcrit <- lapply(windows_smooth, FUN = function(windows_smooth)
  lapply(windows_v, FUN = function(windows_v) data.frame(timestamp = rep(NA, window_plot),
                                                                             w_v = windows_v))
)
names(d_allcrit) <- windows_smooth
d_allcrit <- lapply(d_allcrit, function(x) {names(x) <-  windows_v; x})

#dataframe for all OOAs (onset of acceleration)
d_allooa <- data.frame(w_smooth = NA, OOA = as.POSIXct(NA))

#dataframe for all forecasts (ttf = time to failure)
d_allttf <- lapply(windows_smooth, FUN = function(windows_smooth) data.frame(timestamp = rep(NA, window_plot),
                                                                             w_smooth = windows_smooth))
names(d_allttf) <- windows_smooth

#dataframe for all forecasts (tof = time of failure)
d_alltof <- lapply(windows_smooth, FUN = function(windows_smooth) data.frame(timestamp = rep(NA, window_plot),
                                                                             w_smooth = windows_smooth))
names(d_alltof) <- windows_smooth
