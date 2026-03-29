##plot 3: OOA detection plot

#prepare data for plotting
#create list and control number
datalist4 <- list()
z <- 0

#loop through all windows
for (w_v in windows_v) {

#select number of current w_v
ww <- which(w_v == windows_v)

#subset criteria (1 dataframe per criterion and w_v) and put in list
for (k in 3:6) {
  z <- z+1
  d_allgg <- data.frame(timestamp = d_allcrit[[w]][[ww]][(s-window_plot):s,1],
                                       w_v = as.factor(paste0(d_allcrit[[w]][[ww]][(s-window_plot):s,2]/time_factor, "-", k-2)),
                                       crit = as.factor(d_allcrit[[w]][[ww]][(s-window_plot):s,k]))
  datalist4[[z]] <- d_allgg
}
}

#merge all criteria into 1 dataframe
d_allgg <- bind_rows(datalist4)

#ggplot 3 OOA detection Basis=========================================================================
g3 <- ggplot() +
  ggtitle(paste0("OOA detection criteria | ", "w_smooth = ", w_smooth)) +
  theme_light(base_size = basesize) +
  theme(axis.text.y = element_text(size =  basesize-length(windows_v)-3)) +
  ylab("OOA det. criteria") +
  scale_x_datetime(labels = date_format("%b/%d", tz="UTC"),
                   limits = xlimits,
                   breaks = function(x) xbreaks,
                   date_minor_breaks = xminorbreaks,
                   name = "",
                   expand = c(0.01,0)) +
  scale_y_discrete(limits = rev)

#plot all criteria
g3 <- g3 + geom_tile(data = d_allgg, aes(x = timestamp, y = w_v,
                                         fill = crit))

#scale fill to green and red
g3 <- g3 + scale_fill_manual(values = c("black", "grey99"), breaks = c("0", "1"),
                             guide = "none")

#plot horizontal lines
g3 <- g3 + geom_hline(yintercept = seq(0,z,4)+0.5, size = 0.25)

#plot latest-w_smooth
if (unit_exp == "s")   {g3 <- g3 + geom_vline(xintercept = latest-w_smooth/time_factor, size = 0.4, lty = 3)} #in seconds
if (unit_exp == "min") {g3 <- g3 + geom_vline(xintercept = latest-w_smooth/time_factor*60, size = 0.4, lty = 3)} #in minutes
if (unit_exp == "h")   {g3 <- g3 + geom_vline(xintercept = latest-w_smooth/time_factor*60*60, size = 0.4, lty = 3)} #in hours
if (unit_exp == "d")   {g3 <- g3 + geom_vline(xintercept = latest-w_smooth/time_factor*60*60*24, size = 0.4, lty = 3)} #in days

#plot failure line if already known
if (!is.na(actual_tof) & latest >= actual_tof) {
  g3 <- g3 + geom_vline(xintercept = actual_tof, col ="red", size=0.5, lty = 2)
  g3 <- g3 + annotate(geom="text", x = actual_tof, y = 3.5, label="failure",
                      color="red", size = 3, hjust = 1) }

#display and save supplementary plot if option is 'on'
if (suppl_opt == "on") {
  print(g3)
  ggsave(paste0("1c_OOAdet_", nrow(d_alldispl), ".jpeg"), device = "jpeg", path = suppl,
         width = 20, height = 10, units = "cm")
}
