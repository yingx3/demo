##plot 1: displacement plot

#limits for y-axis of displacement
ylimits1 <- c(floor(min(d_alldispl[,w+2], na.rm = TRUE)),
              ceiling(max(d_alldispl[,w+2], na.rm = TRUE)))

#ggplot 1 displacement Basis
g1 <- ggplot() +
  ggtitle(paste0("displacement | ", "w_smooth = ", w_smooth)) +
  theme_light(base_size = basesize) +
  ylab(paste0("displacement [", unit_displ, "]")) +
  scale_x_datetime(labels = date_format("%b/%d", tz="UTC"),
                   limits = xlimits,
                   breaks = function(x) xbreaks,
                   date_minor_breaks = xminorbreaks,
                   name = "",
                   expand = c(0.01,0)) +
  scale_y_continuous(limits = ylimits1,
                     breaks = seq(ylimits1[1],ylimits1[2],length.out = 6),
                     minor_breaks = seq(ylimits1[1],ylimits1[2],length.out = 11),
                     expand = c(0,0))

#plot displacement
g1 <- g1 + geom_line(data=d_alldispl, aes(x=d_alldispl[,1], y=d_alldispl[,w+2]))

#plot failure line if already known
if (!is.na(actual_tof) & latest >= actual_tof) {
  g1 <- g1 + geom_vline(xintercept = actual_tof, col ="red", size=0.5, lty = 2)
  g1 <- g1 + annotate(geom="text", x = actual_tof, y = mean(c(mean(ylimits1), ylimits1[1])), label="failure",
                        color="red", size = 3, hjust = 1) }

#display and save supplementary plot if option is 'on'
if (suppl_opt == "on") {
print(g1)
ggsave(paste0("1a_displ_", nrow(d_alldispl), ".jpeg"), device = "jpeg", path = suppl,
       width = 20, height = 10, units = "cm")
}
