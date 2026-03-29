##plot 6: boxplot of predicted tof after OOA is detected
if (!is.na(OOA)) {
#only start plotting 3 timesteps after OOA detection for nicer plots
if (nrow(d_alldispl) > which(d_alldispl[,1] == OOA)+3) {

#create data for boxplot===================================
#extract tof
d_boxplot <- d_alltof[[w]][-1,-c(1,2)]

#change columns names
colnames(d_boxplot) <- as.factor(windows_v/time_factor)

#melt dataframe to long format
suppressMessages(
  d_boxplot <-  melt(d_boxplot, na.rm = TRUE)
)

#create dataframe with all forecasts
d_boxplot_all <- data.frame(variable = as.factor("all"), value = d_boxplot$value)

#combine into one dataframe
d_boxplot <- rbind(d_boxplot_all,d_boxplot)

#sort factor for order of x-axis
d_boxplot$variable <- factor(d_boxplot$variable, levels = c("all", sort(as.numeric(windows_v/time_factor))))

#calculate range of latest forecasts
ttf_min <- min(as.numeric(d_alltof[[w]][s,3:ww]), na.rm = T)
ttf_max <- max(as.numeric(d_alltof[[w]][s,3:ww]), na.rm = T)

#create boxplot==========================================
#ggplot 6 boxplot Basis
g6 <- ggplot() +
  ggtitle(paste0("all forecasts"), ) +
  theme_light(base_size = basesize-2) +
  theme(axis.text.x = element_text(size =  basesize-length(windows_v)-2)) +
  xlab("w_v") +
  scale_y_datetime(labels = date_format("%b/%d", tz="UTC"),
                   limits = c(floor_date(OOA, unit = yminorbreaks),
                              ceiling_date(
                                max(
                                latest, #current time
                                as.POSIXct(ttf_max+(ttf_max-ttf_min)/2, origin = "1970-01-01", tz = "UTC"), #failure window max
                                ceiling_date(quantile(d_boxplot$value, 0.95), unit = yminorbreaks)), #upper limit of boxplots
                                unit = yminorbreaks)),
                   breaks = function(x) ybreaks,
                   date_minor_breaks = yminorbreaks,
                   name = "",
                   expand = c(0,0))


#plot failure window as grey area
g6 <- g6 + geom_rect(aes(xmin = -Inf, xmax = Inf, 
                         ymin = as.POSIXct(ttf_min-(ttf_max-ttf_min)/2, origin = "1970-01-01", tz = "UTC"),
                         ymax = as.POSIXct(ttf_max+(ttf_max-ttf_min)/2, origin = "1970-01-01", tz = "UTC")),
                     fill = "grey", alpha = 0.3)

#plot OOA time as line
g6 <- g6 + geom_hline(yintercept = OOA, lty = 2, col = "darkgreen", size = 0.5)

#plot current time as line
g6 <- g6 + geom_hline(yintercept = latest, size = 0.5, col = "black", alpha = 0.7)

#plot failure line if already known
if (!is.na(actual_tof) & latest >= actual_tof) {
  g6 <- g6 + geom_hline(yintercept = actual_tof, col ="red", size=0.5, lty = 2)}

#plot boxplots
g6 <- g6 + geom_boxplot(data = d_boxplot, aes(x = variable, y = value, group=variable, fill = variable),
                        alpha = 0.5, width = 0.8,
                        position = position_dodge(1))

#scale color
g6 <- g6  +  scale_fill_manual(breaks = c("all", sort(as.numeric(windows_v/time_factor))),
                               values = c("#c1c1c1", colors),
                               name = "velocity window (w_v)")

#plot latest time of failure
for (k in c(3:ww)) {
  d_allgg <- data.frame(x = as.factor(windows_v/time_factor)[k-2],
                        tof =  d_alltof[[w]][s,k])
  g6 <- g6 + geom_point(data = d_allgg, aes(x=x, y=tof), pch=18, col="red", size = 3)
}

#display and save supplementary plot if option is 'on'
if (suppl_opt == "on") {
print(g6)
ggsave(paste0("1g_box-tof_", nrow(d_alldispl), ".jpeg"), device = "jpeg", path = suppl,
       width = 10, height = 20, units = "cm")
}

#close if 3 steps after OOA
} else {g6 <- ggplot()}
  
#close if OOA is NA
} else {g6 <- ggplot()}
