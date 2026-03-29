##plot 2: inverse velocity plot

#limits for y-axis of inverse velocity
ylimits2 <- c(0,
              ceiling((quantile(d_alliv[[w]][(s-window_plot):s,
                      3:ww],  0.98, na.rm = TRUE))/10)*10 #round up to the next 10
              )

#ggplot 2 velocity Basis
g2 <- ggplot() +
  ggtitle(paste0("inverse velocity | ", "w_smooth = ", w_smooth)) +
  theme_light(base_size = basesize) +
  ylab(paste0("inverse velocity [", unit_iv, "]")) +
  scale_x_datetime(labels = date_format("%b/%d", tz="UTC"),
                   limits = xlimits,
                   breaks = function(x) xbreaks,
                   date_minor_breaks = xminorbreaks,
                   name = "",
                   expand = c(0.01,0)) +
  scale_y_continuous(limits = ylimits2,
                     breaks = seq(0,ylimits2[2], length.out = 6),
                     minor_breaks = seq(0,ylimits2[2],length.out = 11),
                     expand = c(0,0))

#plot inverse velocity
for (k in c(3:ww)) {
  d_allgg <- data.frame(timestamp = d_alliv[[w]][,1],
                        iv =  d_alliv[[w]][,k])
  g2 <- g2 + geom_line(data = d_allgg, aes(x=timestamp, y=iv, col=as.factor(iv[1]/time_factor)))
}

#scale color according to w_v
g2 <- g2 + scale_color_manual(breaks = sort(as.numeric(windows_v/time_factor)),
                              name = "velocity window (w_v)",
                              values = colors)

#plot failure line if already known
if (!is.na(actual_tof) & latest >= actual_tof) {
  g2 <- g2 + geom_vline(xintercept = actual_tof, col ="red", size=0.5, lty = 2)
  g2 <- g2 + annotate(geom="text", x = actual_tof, y = mean(ylimits2), label="failure",
                      color="red", size = 3, hjust = 1) }

#display and save supplementary plot if option is 'on'
if (suppl_opt == "on") {
print(g2)
ggsave(paste0("1b_iv_", nrow(d_alldispl), ".jpeg"), device = "jpeg", path = suppl,
       width = 20, height = 10, units = "cm")
}
