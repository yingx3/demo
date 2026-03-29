##plot 5: life expectancy plot after OOA is detected

#fix ww independent from if OOA is NA 
ww <- length(windows_v) +2

#limits for y-axis of life expectancies
ylimits5 <- c(-10, window_plot*5/6/time_factor)

#ggplot 5 life expectancy Basis
g5 <- ggplot() +
  ggtitle(paste0("smoothing window (w_smooth) = ", w_smooth/time_factor, unit_exp)) +
  theme_light(base_size = basesize) +
  ylab(paste0("life expectancy [", unit_exp, "]")) +
  scale_x_datetime(labels = date_format("%b/%d", tz="UTC"),
                   limits = xlimits,
                   breaks = function(x) xbreaks,
                   date_minor_breaks = xminorbreaks,
                   name = "",
                   expand = c(0.01,0))

#ybreaks depending on unit
if (unit_exp == "s")   {g5 <- g5 + scale_y_continuous(breaks = seq(0,ylimits5[2],100),
                                                      minor_breaks = seq(0,ylimits5[2],50), expand = c(0,0))}
if (unit_exp == "min") {g5 <- g5 + scale_y_continuous(breaks = seq(0,ylimits5[2],60),
                                                      minor_breaks = seq(0,ylimits5[2],10), expand = c(0,0))}
if (unit_exp == "h")   {g5 <- g5 + scale_y_continuous(breaks = seq(0,ylimits5[2],24),
                                                      minor_breaks = seq(0,ylimits5[2],12), expand = c(0,0))}
if (unit_exp == "d")   {g5 <- g5 + scale_y_continuous(breaks = seq(0,ylimits5[2],10),
                                                      minor_breaks = seq(-5,ylimits5[2],5), expand = c(0,0))}
#fix axis for 1:1 plot
if (unit_exp == "s")   {g5 <- g5 + coord_fixed(ratio = 1/1, ylim = ylimits5)} #y in seconds / x in seconds
if (unit_exp == "min") {g5 <- g5 + coord_fixed(ratio = 1/1*60, ylim = ylimits5)} #y in minutes / x in seconds
if (unit_exp == "h")   {g5 <- g5 + coord_fixed(ratio = 1/1*60*60, ylim = ylimits5)} #y in hours / x in seconds
if (unit_exp == "d")   {g5 <- g5 + coord_fixed(ratio = 1/1*60*60*24, ylim = ylimits5)} #y in days / x in seconds


if (!is.na(OOA)) {

#calculate mean and standard deviation of forecasts
d_allttf[[w]]$mean <- rowMeans(d_allttf[[w]][,c(3:ww)], na.rm=TRUE)
d_allttf[[w]]$sd <- apply(d_allttf[[w]][3:ww],1, sd, na.rm = TRUE)
# 获取最新的（最后一个非NA）mean值和时间戳
valid_indices <- which(!is.na(d_allttf[[w]]$mean))
if (length(valid_indices) > 0) {
  latest_index <- max(valid_indices)
  latest_mean <- d_allttf[[w]]$mean[latest_index]
  latest_timestamp <- d_allttf[[w]]$timestamp[latest_index]
  
  # 创建要保存的数据列表
  mean_data <- list(
    rt = latest_mean,
    time = as.character(latest_timestamp),
    extraction_time = as.character(Sys.time())
  )
  
  # 将数据保存为JSON文件
  json_data <- jsonlite::toJSON(mean_data, auto_unbox = TRUE, pretty = TRUE)
  write(json_data, "rt_data.json")
  
  cat(sprintf("距离滑坡还有: %.2f %s！\n", latest_mean, unit_exp))
  # cat(sprintf("对应时间戳: %s\n", as.character(latest_timestamp)))
  # cat("数据已保存到 latest_mean_data.json 文件\n\n")
} else {
  cat("未检测到滑坡！")
  
  # 即使没有有效数据，也创建一个空的JSON文件记录状态
  error_data <- list(
    error = "未检测到滑坡！",
    status = "all_NaN",
    check_time = as.character(Sys.time())
  )
  json_data <- jsonlite::toJSON(error_data, auto_unbox = TRUE, pretty = TRUE)
  write(json_data, "rt_data.json")
  cat("错误状态已保存到 rt_data.json 文件\n\n")
}

#calculate failure window
d_allttf[[w]]$delta <- apply(d_allttf[[w]][3:ww],1, max, na.rm = TRUE)-apply(d_allttf[[w]][3:ww],1, min, na.rm = TRUE)
d_allttf[[w]]$w_f1 <- apply(d_allttf[[w]][3:ww],1, min, na.rm = TRUE) - 0.5*d_allttf[[w]]$delta
d_allttf[[w]]$w_f2 <- apply(d_allttf[[w]][3:ww],1, max, na.rm = TRUE) + 0.5*d_allttf[[w]]$delta
  
#plot failure window and mean
g5 <- g5 + geom_ribbon(data = d_allttf[[w]], aes(x=timestamp, ymax=w_f2, ymin=w_f1), fill="grey70", alpha=0.2)
g5 <- g5 + geom_line(data = d_allttf[[w]], aes(x=timestamp, y=mean), col = "black", size = 1.2)

#plot time to failure
for (k in c(3:ww)) {
  d_allgg <- data.frame(timestamp = d_allttf[[w]][,1],
                        ttf =  d_allttf[[w]][,k])
  g5 <- g5 + geom_point(data = d_allgg, aes(x=timestamp, y=ttf, col=as.factor(ttf[1]/time_factor)), size = 0.5)
}

#close if OOA is NA
} else {
  #to produce a plot with legend for plot7_combi.R
  # 创建要保存的数据列表
  mean_data <- list(
    rt = -1,
    time = latest,
    extraction_time = as.character(Sys.time())
  )
  
  # 将数据保存为JSON文件
  json_data <- jsonlite::toJSON(mean_data, auto_unbox = TRUE, pretty = TRUE)
  write(json_data, "rt_data.json")
  cat("未检测到滑坡！")
  for (k in c(3:ww)) {
    d_allgg <- data.frame(timestamp = latest,
                          forlegend =  d_alliv[[w]][c(1,s),k])
    g5 <- g5 + geom_point(data = d_allgg, aes(x=timestamp, y=forlegend*Inf, col=as.factor(forlegend[1]/time_factor)), size = 0.5)
  }

#close else
}

#scale color according to w_v
g5 <- g5 + scale_color_manual(breaks = sort(as.numeric(windows_v/time_factor)),
                              name = "velocity window (w_v)",
                              values = colors)

#add line at y = 0
g5 <- g5 + geom_hline(aes(yintercept = 0), col ="black", size=0.5)

#plot OOA if already known
if (!is.na(OOA) & latest >= OOA) {
  g5 <- g5 + geom_vline(xintercept = OOA, col ="darkgreen", size=0.5, lty = 2)
  g5 <- g5 + annotate(geom="text", x = OOA, y = 0.75*max(ylimits5), label="OOA",
                      color="darkgreen", size = 3, hjust = 1) }

#plot failure line if already known
if (!is.na(actual_tof) & latest >= actual_tof) {
  g5 <- g5 + geom_vline(xintercept = actual_tof, col ="red", size=0.5, lty = 2)
  g5 <- g5 + annotate(geom="text", x = actual_tof, y = mean(ylimits5), label="failure",
                      color="red", size = 3, hjust = 1) }

#annotate timestamp in big
g5 <- g5 + annotate(geom="text", x = d_alldispl$timestamp[nrow(d_alldispl)-0.25*window_plot],
                    y = 0.92*ylimits5[2],
                    label = as.character(latest, format = "%Y-%m-%d %H:%M"),
                    color = "black", size = 8)

#display and save supplementary plot if option is 'on'
if (suppl_opt == "on") {
print(g5)
ggsave(paste0("1f_lifeexp_", nrow(d_alldispl), ".jpeg"), device = "jpeg", path = suppl,
       width = 25, height = 12.5, units = "cm")
}
